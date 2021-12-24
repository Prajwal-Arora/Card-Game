export const addressSubstring=(walletAddress: string)=>{
    const accountEllipsis = walletAddress ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 7)}` : '';
    return accountEllipsis
}

export const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert('Address copied');
}