export const shortenAddress = (address: string): string => {
  if (address.length <= 10) {
    // return full address if it's short (ex> 0x1)
    return address;
  }
  return address.slice(0, 6) + '...' + address.slice(-4);
};
