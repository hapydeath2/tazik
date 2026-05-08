
export async function sendPayment(toAddress, priceETH) {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const price = Number(priceETH || 0);

  if (isNaN(price)) throw new Error("Invalid price value");

  const valueWei = BigInt(Math.round(Number(priceETH) * 1e18));

  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [{
      from: accounts[0],
      to: toAddress,
      value: "0x" + valueWei.toString(16),
    }],
  });

  return txHash;
}