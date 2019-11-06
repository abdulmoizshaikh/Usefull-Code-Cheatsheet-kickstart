//state of our functional component
const [stateImagesArray, setStateImagesArray] = useState({
    id: "upload-photo",
    imageArray: [],
    imgFiles: []
})

//onChangeFileHandler
const handleChange = (e) => {
    readURI(e);
}

//read images and set array of string images into state
function readURI(e) {
    const imgFiles = e.target.files;
    if (imgFiles) {
        setStateImagesArray(prevState => ({ ...prevState, imgFiles }))
        /* Get files in array form */
        const files = Array.from(imgFiles);

        /* Map each file to a promise that resolves to an array of image URI's */
        Promise.all(files.map(file => {
            return (new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener('load', (ev) => {
                    resolve(ev.target.result);
                });
                reader.addEventListener('error', reject);
                reader.readAsDataURL(file);
            }));
        }))
            .then(images => {
                /* Once all promises are resolved, update state with image URI array */
                setStateImagesArray(prevState => ({ ...prevState, imageArray: images }))
            }, error => {
                console.error(error);
            });
    }
}

//this function call when we submit our form this will push images to clounary and give us object with public_id which we store in database
async function uploadImagesToCloudnary() {
    const { imgFiles } = stateImagesArray;
    for (let i = 0; i < imgFiles.length; i++) {
        const CLOUDINARY_UPLOAD_PRESET = 'tbvpvdzo'
        var formData = new FormData();
        formData.append('file', imgFiles[i]);
        const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/sar-com/image/upload';
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const uploadImage = await axios.post(CLOUDINARY_URL, formData);
        const { public_id } = uploadImage.data;
        setState(prevState => ({ ...prevState, img: state.img.push(public_id) }))
    }
    onSubmitFormHandler()
}

async function onSubmitFormHandler() {
    try {
        console.log("state", state)
        if (!stateIsEmpty(state)) {
        const result = await dispatch(productActions.addProduct(state))
        console.log("result", result)
        setStateToEmpty()
        } else {
            utils._toast('Somthing went Wrong! All feilds are requires', 'error')
            setStateToEmpty()
        }
    } catch (error) {
        console.log("error in comp", error)
        utils._toast('Somthing went Wrong! All feilds are requires', 'error')
        setStateToEmpty()
    }
}

function buildImgTag() {
    return stateImagesArray.imageArray.map(imageURI => (<Card style={{ width: '20%', margin: 10 }} key={imageURI}>
        <CardBody style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img className="photo-uploaded" style={{ width: '100%' }} src={imageURI} alt="ph uploaded" />
        </CardBody>
    </Card>
    ))
}



//render part
//input tag for input image files one or more (form is comming from material ui)
<Form>
    <FormGroup>
        <Label for="exampleImages">Product Images</Label>
        <div>
            <input
                id={stateImagesArray.id}
                type="file"
                name=""
                accept="image/gif,image/jpeg,image/jpg,image/png,video/mp4,video/x-m4v"
                title="Add photos or video"
                onChange={handleChange}
                multiple
            />
        </div>
        <FormText color="muted">
            Notice : The first selected product will be the cover photo for display
            </FormText>
        <Row>
            {buildImgTag()}  //to render uploaded images into DOM
        </Row>
    </FormGroup>
    <Button color="primary" className="mt-1" onClick={uploadImagesToCloudnary}>Submit</Button>
</Form>



// Render image by public_id in react front end client side using cloudnary-react npm pkg

import { Image, Video, Transformation, CloudinaryContext } from 'cloudinary-react';


 <Image cloudName="sar-com" publicId={item.img[0]} width="280" height="350" crop="scale" responsive>
    <Transformation height="300" width="280" crop="fill" gravity="faces" radius="5" />
</Image>


