const { SaleLists } = require('../models');

// get all the comicbooks for sale for public display
exports.getALLSaleLists = async (req, res) => {
  // const { userId } = req.params;

  try {
    const saleLists = await SaleLists.findAll();
    // Use for endpoints
    // const { comicBookTitle } = req.body;
    // const saleLists = await SaleLists.findAll({ where: { comicBookTitle } });

    // respond with json of the public questions array
    res.json(saleLists);
  } catch (e) {
    // map the errors messages to send them back
    const errors = e.errors.map(err => err.message);
    res.status(500).json({ errors });
  }
};
