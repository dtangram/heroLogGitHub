exports.renderHome = async (req, res) => {
  const home = await req.API.get('/');
  res.render('../../../reactjs/src/components/home', { home });
};
