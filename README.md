A set of scripts to automatically generate an NFT smart contract, verify and deploy.

Make sure you have your ENV variables set in a `.env` file, before running any of the scripts.

Before rendering set configure contract behavior in `options.json`. You can also have a separate `options.rinkeby.json` for a testnet.

Contract template is under `templates/contracts/sourceName.sol.njk`.

After running `ts-node render` the actual contract file will appear in `contracts/`.

```
ts-node render
ts-node verify
ts-node deploy
```

## License

This is released under the [MIT License](https://github.com/gasvard/dolly/blob/main/LICENSE).
