import Layout from "@/components/Layout";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";
import {RiDeleteBin6Line} from "react-icons/ri";
import {FiEdit} from "react-icons/fi";


export default function Products() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get("/api/products")
            .then((response) => {
                setProducts(response.data)
            })
    }, [])

    return (<Layout>
        <Link
            className={"btn-primary"}
            href={"/products/new"}
        >
            Add new product
        </Link>
        <table className={"basic mt-2"}>
            <thead>
            <tr>
                <td>Product Name</td>
                <td></td>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product._id}>
                    <td>
                        {product.title}
                    </td>
                    <td>
                        <Link
                            className={"btn-default"}
                            href={'/products/edit/' + product._id}
                        >
                            <FiEdit size={16}/>
                            Edit
                        </Link>
                        <Link
                            className={"flex justify-content-center items-center btn-red"}
                            href={'/products/delete/' + product._id}
                        >
                            <RiDeleteBin6Line size={16}/>
                            Delete
                        </Link>
                    </td>
                </tr>))}
            </tbody>

        </table>
    </Layout>)

}