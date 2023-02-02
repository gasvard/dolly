require('dotenv').config()

const ethers = require('ethers')
const path = require('path')
const fs = require('fs')
const solc = require('solc')

const config = require('./config').default

const main = async () => {
  const {
    sourceName,
    contractName,
    constructorArguments,
    deployerAddress,
  } = config

  const deployerWallet = new ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY,
    new ethers.providers.InfuraProvider(
      config.deployment.network,
      process.env.INFURA_ID,
    ),
  )

  if (deployerAddress != (await deployerWallet.getAddress())) {
    throw 'Deployer address and private keys do not match'
  }

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
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  }

  const factory = ethers.ContractFactory.fromSolidity(
    JSON.parse(solc.compile(JSON.stringify(input))).contracts[sourceName][
      contractName
    ],
  ).connect(deployerWallet)

  const contract = await factory.deploy(...constructorArguments, {
    gasPrice: ethers.BigNumber.from(config.deployment.gasPrice),
    gasLimit: ethers.BigNumber.from(
      Math.round(parseInt(config.deployment.gasLimit) * 1.13),
    ),
  })

  console.log('Contract address: ', contract.address)
  console.log('Deploying the contract…')

  contract.deployTransaction.wait().then((receipt) => {
    console.log('Contract deployment tx:')
    console.log(receipt.transactionHash)
    console.log('Deployed ✅')
  })
}

main()
// .then(() => process.exit(0))
// .catch((error) => {
//   console.error(error)
//   process.exit(1)
// })
