import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import {ReactSortable} from "react-sortablejs";
import Image from 'next/image'

export default function ProductForm({
                                        _id,
                                        title: existingTitle,
                                        description: existingDescription,
                                        price: existingPrice,
                                        images: existingImages,
                                        category: assignedCategory,
                                        properties: assignedProperties,
                                    }) {
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [price, setPrice] = useState(existingPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [category, setCategory] = useState(assignedCategory || '')
    const [categories, setCategories] = useState([])
    const [productProperties, setProductProperties] = useState(assignedProperties || {})
    const router = useRouter()

    useEffect(() => {
        axios.get('/api/categories')
            .then((result) => {
                setCategories(result.data)
            })
    }, [])

    async function saveProduct(event) {
        event.preventDefault()

        const data = {title, description, price, images, category, properties: productProperties}

        if (_id) {
            // update
            await axios.put('/api/products', {...data, _id})
        } else {
            // create
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }

    if (goToProducts) {
        router.push('/products')
    }

    async function uploadImages(event) {
        // const files = event.target?.files
        // if (files?.length > 0) {
        //     setIsUploading(true)
        //     const data = new FormData()
        //     for (const file of files) {
        //         data.append('file', file)
        //     }
        //     const res = await axios.post('/api/upload', data)
        //     setImages(oldImages => {
        //         return [...oldImages, res.data.links]
        //     })
        //     setIsUploading(false)
        // }
    }

    function updateImagesOrder(images) {
        setImages(images)
    }

    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let categoryInfo = categories.find(({_id}) => _id === category)
        propertiesToFill.push(...categoryInfo.properties)
        while (categoryInfo?.parent?._id) {
            const parentCategory = categories.find(({_id}) => _id === categoryInfo?.parent?._id)
            propertiesToFill.push(...parentCategory.properties)
            categoryInfo = parentCategory
        }
    }

    function setProductProp(propName, value) {
        setProductProperties(prevState => {
            const newProductProps = {...prevState}
            newProductProps[propName] = value
            return newProductProps
        })
    }


    // PUBLIC DİZİNİNE KAYDETMEK İÇİN

    // const [image, setImage] = useState(null);
    // const [createObjectURL, setCreateObjectURL] = useState(null);
    //
    // const uploadToClient = (event) => {
    //     if (event.target.files && event.target.files[0]) {
    //         const i = event.target.files[0];
    //
    //         setImage(i);
    //         setCreateObjectURL(URL.createObjectURL(i));
    //     }
    // };
    //
    // const uploadToServer = async (event) => {
    //     const body = new FormData();
    //     // console.log("file", image)
    //     body.append("file", image);
    //     const response = await fetch("/api/upload", {
    //         method: "POST",
    //         body
    //     });
    // };

    return (
        <form onSubmit={saveProduct}>
            {/*PUBLIC DİZİNİNE KAYDETMEK İÇİN*/}
            {/*<div>*/}
            {/*    <img src={createObjectURL}/>*/}
            {/*    <h4>Select Image</h4>*/}
            {/*    <input type="file" name="myImage" onChange={uploadToClient}/>*/}
            {/*    <button*/}
            {/*        className="btn btn-primary"*/}
            {/*        type="submit"*/}
            {/*        onClick={uploadToServer}*/}
            {/*    >*/}
            {/*        Send to server*/}
            {/*    </button>*/}
            {/*</div>*/}
            <label>Product Name</label>
            <input
                type="text"
                value={title}
                onChange={event => setTitle(event.target.value)}
                placeholder={"Product Name"}
            />

            <label>Photos</label>
            <div className={"flex flex-wrap gap-2 mb-2"}>
                <ReactSortable list={images} setList={updateImagesOrder} className={"flex flex-wrap gap-1"}>
                    {!!images?.length && images.map((link) => (
                        <div key={link} className={"h-24 bg-white p-4 shadow-sm rounded-lg border border-gray-200"}>
                            {/*<img src={logo} alt="product-image" className={"rounded-lg"}/>*/}
                        </div>
                    ))}
                </ReactSortable>

                {isUploading && (
                    <div className={"flex justify-center items-center"}>
                        <Spinner/>
                    </div>
                )}

                <label
                    className={"w-24 h-24 bg-white flex flex-col items-center justify-center text-sm text-primary" +
                        "rounded-lg cursor-pointer shadow-md border border-primary "}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                    Add Image
                    <input type="file" onChange={uploadImages} hidden={true}/>
                </label>
                {/*{!images?.length && (*/}
                {/*    // <img src={logo} alt="product-image" className={"rounded-lg"}/>*/}
                {/*)}*/}
            </div>


            <label>Category</label>
            <select
                value={category}
                onChange={event => setCategory(event.target.value)}
            >
                <option value="">Uncategorized</option>
                {categories?.length > 0 && categories.map((c, index) => (
                    <option key={index} value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map((property, index) => (
                <div key={index} className={"grid grid-cols-6"}>
                    <div className={"capitalize"}>
                        {property.name}
                    </div>

                    <div className={"col-span-5"}>
                        <select
                            value={productProperties[property.name]}
                            onChange={(event) => setProductProp(property.name, event.target.value)}
                        >
                            <option value="">Please select...</option>
                            {property.values.map((v, index) => (
                                <option key={index} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))
            }

            <label>Description</label>
            <textarea
                value={description}
                onChange={event => setDescription(event.target.value)}
                placeholder={"Description"}
            />

            <label>Price (in USD)</label>
            <input
                type="number"
                value={price}
                onChange={event => setPrice(event.target.value)}
                placeholder={"Price"}
            />

            <button
                type={"submit"}
                className={"btn-primary"}
            >
                Save
            </button>
        </form>
    )
}