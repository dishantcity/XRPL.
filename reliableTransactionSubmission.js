const { Client, Payment } = require('xrpl');

const client = new Client("wss://s.altnet.rippletest.net:51233");

sendReliableTx();

async function sendReliableTx() {
  await client.connect();

  const { wallet: wallet1 } = await client.fundWallet();
  const { wallet: wallet2 } = await client.fundWallet();

  console.log("Balances of wallets before Payment tx");
  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`);
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`);

  const payment = {
    TransactionType: "Payment",
    Account: wallet1.classicAddress,
    Amount: "1000",
    Destination: wallet2.classicAddress,
  };

  console.log("Submitting a Payment transaction...");
  const paymentResponse = await client.submitAndWait(payment, {
    wallet: wallet1,
  });
  console.log("\nTransaction was submitted.\n");
  const txResponse = await client.request({
    command: "tx",
    transaction: paymentResponse.result.hash,
  });
  console.log("Validated:", txResponse.result.validated);

  console.log("Balances of wallets after Payment tx:");
  console.log(`Balance of ${wallet1.classicAddress} is ${await client.getXrpBalance(wallet1.classicAddress)}XRP`);
  console.log(`Balance of ${wallet2.classicAddress} is ${await client.getXrpBalance(wallet2.classicAddress)}XRP`);
  
  await client.disconnect();
}
