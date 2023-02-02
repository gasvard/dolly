require('dotenv').config()

const ethers = require('ethers')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const solc = require('solc')
const qs = require('qs')

const config = require('./config').default

const main = async () => {
  const contractAddress = process.argv[2]
  if (!contractAddress) return

  const { sourceName, contractName, constructorArguments } = config

  const contractPath = path.resolve(__dirname, 'contracts', sourceName)
  const source = fs.readFileSync(contractPath, 'utf8')

  const input = {
    language: 'Solidity',
    sources: {
      [sourceName]: {
        content: source,
      },
    },
    settings: {
      optimizer: {
        runs: 200,
        enabled: true,
      },
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  }

  const solcVersion = JSON.parse(
    JSON.parse(solc.compile(JSON.stringify(input))).contracts[sourceName][
      contractName
    ].metadata,
  ).compiler.version

  const factory = ethers.ContractFactory.fromSolidity(
    JSON.parse(solc.compile(JSON.stringify(input))).contracts[sourceName][
      contractName
    ],
  )

  console.log(
    'Verifying the source code on Etherscan:',
    contractAddress,
    `${sourceName}:${contractName}`,
    solcVersion,
  )
  axios({
    method: 'POST',
    url:
      config.deployment.network === 'mainnet'
        ? 'https://api.etherscan.io/api'
        : 'https://api-rinkeby.etherscan.io/api',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({
      apiKey: process.env.ETHERSCAN_API_KEY,
      module: 'contract',
      action: 'verifysourcecode',
      contractaddress: contractAddress,
      sourceCode: JSON.stringify(input),
      codeformat: 'solidity-standard-json-input',
      contractname: `${sourceName}:${contractName}`,
      compilerversion: `v${solcVersion}`,
      optimizationUsed: 1,
      runs: 200,
      constructorArguements: factory.interface
        .encodeDeploy(constructorArguments)
        .slice(2),
    }),
  }).then((r) => {
    console.log('Verification result: ', r.data.result)
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
