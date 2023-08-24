const { Client, Payment } = require('xrpl');

const client = new Client('wss://s.altnet.rippletest.net:51233');

async function createTxWithPaths() {
  await client.connect();

  const { wallet } = await client.fundWallet();
  const destination_account = 'rKT4JX4cCof6LcDYRz8o3rGRu7qxzZ2Zwj';
  const destination_amount = {
    value: '0.001',
    currency: 'USD',
    issuer: 'rVnYNK9yuxBz4uP8zC8LEFokM2nqH3poc',
  };

  const request = {
    command: 'ripple_path_find',
    source_account: wallet.classicAddress,
    source_currencies: [
      {
        currency: 'XRP',
      },
    ],
    destination_account,
    destination_amount,
  };

  const resp = await client.request(request);
  console.log("Ripple Path Find response: ", resp);

  const paths = resp.result.alternatives[0].paths_computed;
  console.log("Computed paths: ", paths);

  const tx = {
    TransactionType: 'Payment',
    Account: wallet.classicAddress,
    Amount: destination_amount,
    Destination: destination_account,
    Paths: paths,
  };

  await client.autofill(tx);
  const signed = wallet.sign(tx);
  console.log('signed:', signed);

  await client.disconnect();
}

createTxWithPaths();
