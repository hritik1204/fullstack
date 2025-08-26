export function isPrivateIP(host: string): boolean {
    return (
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^::1$/.test(host)
    );
  }
  