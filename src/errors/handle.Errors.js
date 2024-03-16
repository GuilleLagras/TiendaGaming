export const handleErrors = (res, error) => {
    res
      .status(error.code || 500)
      .json({ message: error.message, name: error.name });
  };