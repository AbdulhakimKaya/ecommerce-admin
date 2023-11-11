import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import {withSwal} from "react-sweetalert2";
import {FiEdit} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";


function Categories({swal}) {
    const [name, setName] = useState('')
    const [editedCategory, setEditedCategory] = useState(null)
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState([])

    useEffect(() => {
        fetchCategories()
    }, [])

    function fetchCategories() {
        axios.get('/api/categories')
            .then((result) => {
                setCategories(result.data)
            })
    }

    async function saveCategory(ev) {
        ev.preventDefault()
        const data = {
            name,
            parentCategory,
            properties: properties.map((property) => (
                {
                    name: property.name,
                    values: property.values.split(',').map((item) => (
                        item.trim()
                    )),
                }
            ))
        }
        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data)
        }

        setName('')
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }

    function editCategory(category) {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values: values.join(',')
            }))
        )
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#dc2626',
            reverseButtons: true,
        })
            .then(async result => {
                if (result.isConfirmed) {
                    const {_id} = category
                    await axios.delete('/api/categories?_id=' + _id)
                    fetchCategories()
                }
            })
    }

    function addProperty() {
        setProperties(prevState => {
            return [...prevState, {name: '', values: ''}]
        })
    }

    function handlePropertyNameChange(index, property, newName) {
        setProperties(prevState => {
            const properties = [...prevState]
            properties[index].name = newName
            return properties
        })
    }

    function handlePropertyValuesChange(index, property, newValues) {
        setProperties(prevState => {
            const properties = [...prevState]
            properties[index].values = newValues
            return properties
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prevState => {
            return [...prevState].filter((p, pIndex) => {
                return pIndex !== indexToRemove
            })
        })
    }

    return (<Layout>
        <h1>Categories</h1>
        <label>
            {editedCategory ? `Edit Category ${editedCategory.name}` : "New Category Name"}
        </label>
        <form onSubmit={saveCategory}>
            <div className={"flex gap-2"}>
                <input
                    type="text"
                    placeholder={"Category Name"}
                    value={name}
                    onChange={ev => setName(ev.target.value)}
                />

                <select
                    value={parentCategory}
                    onChange={event => setParentCategory(event.target.value)}
                >
                    <option value="">No Parent Category</option>
                    {categories?.length > 0 && categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>))}
                </select>
            </div>

            <div className={"mb-2"}>
                <label className={"block"}>Properties</label>
                <button
                    type={"button"}
                    onClick={addProperty}
                    className="btn-default text-sm mb-2"
                >
                    Add New Property
                </button>
                {properties?.length > 0 && properties.map((property, index) => (
                    <div key={index} className={"flex gap-1 mb-2"}>
                        <input
                            type="text"
                            value={property.name}
                            onChange={(event) => handlePropertyNameChange(index, property, event.target.value)}
                            placeholder={"property name (example: color)"}
                            className={"mb-0"}
                        />
                        <input
                            type="text"
                            value={property.values}
                            onChange={(event) => handlePropertyValuesChange(index, property, event.target.value)}
                            placeholder={"values, comma separated"}
                            className={"mb-0"}
                        />
                        <button
                            type={"button"}
                            onClick={() => removeProperty(index)}
                            className="btn-red"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className={"flex gap-1"}>
                <button
                    type={"submit"}
                    className={"btn-primary"}
                >
                    Save
                </button>

                {editedCategory && (
                    <button
                        type={"button"}
                        onClick={()  => {
                            setEditedCategory(null)
                            setName('')
                            setParentCategory('')
                            setProperties([])
                        }}
                        className={"btn-red"}
                    >
                        Cancel
                    </button>
                )}
            </div>

        </form>

        {!editedCategory && (
            <table className={"basic mt-4"}>
                <thead>
                <tr>
                    <td>
                        Category Name
                    </td>
                    <td>
                        Parent Category
                    </td>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                {categories?.length > 0 && categories.map((category) => (<tr key={category?._id}>
                    <td>
                        {category?.name}
                    </td>
                    <td>
                        {category?.parent?.name}
                    </td>
                    <td>
                        <button
                            onClick={event => editCategory(category)}
                            className={"btn-default"}
                        >
                            <FiEdit size={16}/>
                            Edit
                        </button>
                        <button
                            className={"btn-red"}
                            onClick={() => deleteCategory(category)}
                        >
                            <RiDeleteBin6Line size={16}/>
                            Delete
                        </button>
                    </td>
                </tr>))}
                </tbody>
            </table>
        )}
    </Layout>)
}


export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
))