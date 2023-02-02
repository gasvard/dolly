import path from 'path'
import fs from 'fs'
import nunjucks from 'nunjucks'
import config from './config'

const main = async () => {
  const contractTemplate = fs.readFileSync(
    path.resolve(__dirname, 'templates', 'contracts', 'sourceName.sol.njk'),
    'utf8',
  )

  const { sourceName } = config
  const contractString = nunjucks.renderString(contractTemplate, config)

  fs.writeFileSync(
    path.resolve(__dirname, 'contracts', sourceName),
    contractString,
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
