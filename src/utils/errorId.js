export const generateErrorId = () => {
    const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const random = Math.random().toString(16).substring(2, 8).toUpperCase();
    return `ERR-${date}-${random}`;
  };
  