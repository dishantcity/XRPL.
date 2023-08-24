const { Client, Payment, SetRegularKey } = require('xrpl');

const client = new Client('wss://s.altnet.rippletest.net:51233');

async function setRegularKey() {
  await client.connect();
  const { wallet: wallet1 } = await client.fundWallet();
  const { wallet: wallet2 } = await client.fundWallet();
  const { wallet: regularKeyWallet } = await client.fundWallet();

  console.log('Balances before payment');
  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`);
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`);

  const tx = {
    TransactionType: 'SetRegularKey',
    Account: wallet1.classicAddress,
    RegularKey: regularKeyWallet.classicAddress,
  };

  console.log('Submitting a SetRegularKey transaction...');
  const response = await client.submitAndWait(tx, {
    wallet: wallet1,
  });

  console.log('Response for successful SetRegularKey tx');
  console.log(response);

  const payment = {
    TransactionType: 'Payment',
    Account: wallet1.classicAddress,
    Destination: wallet2.classicAddress,
    Amount: '1000',
  };

  const submitTx = await client.submit(payment, {
    wallet: regularKeyWallet,
  });

  console.log('Response for tx signed using Regular Key:');
  console.log(submitTx);
  console.log('Balances after payment:');
  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`);
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`);

  await client.disconnect();
}

setRegularKey();
