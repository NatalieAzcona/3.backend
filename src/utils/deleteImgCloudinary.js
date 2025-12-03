//SI ya agrego el id, tengo que cambiar este código

const cloudinary = require('cloudinary').v2;

const deleteImgCloudinary = (imgUrl) => {
    const imgSplited = imgUrl.split('/');
    const nameSplited = imgSplited.at(-1).split('.')[0];
    const folderSplited = imgSplited.at(-2);
    const public_id = `${folderSplited}/${nameSplited}`;

    cloudinary.uploader.destroy(public_id, () => {
        console.log('Image delete in cloudinary');
    });
};

module.exports = { deleteImgCloudinary };
