import fs from 'fs'
import path from 'path'

type Configuration = {
  sourceName: string
  contractName: string
  ownerAddress: string
  tokenSymbol: string
  constructorArguments: [string]
  payoutAddress: string
  deployerAddress: string
  deployment: {
    gasPrice: string
    gasLimit: string
    network: 'mainnet' | 'rinkeby'
  }
}

const configPath = path.resolve(__dirname, 'options.json')
const config: Configuration = JSON.parse(fs.readFileSync(configPath, 'utf8'))

export default config
