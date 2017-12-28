module.exports = {
	secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'b9a4566aaa7a098e97a0a3d94036cfbd81538b4418199796';
}