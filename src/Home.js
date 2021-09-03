import React, { useEffect, useRef, useState } from 'react';
import base from './api/base';


export default function Home() {

   const propertynameRef = useRef();
   const descriptionRef = useRef();
   const sizeRef = useRef();

    const [ addProperty, setAddProperty] = useState({
        propertyname:"",
        description:"",
        size:""
    });

    const [ propertyList, setPropertyList] = useState([]);

    useEffect(()=>{
        getData();
        },[])
        

    function getData(){
        base('property').select({view: 'Grid view'}).eachPage( (records, fetchNextPage)=>{
            setPropertyList(records);
             fetchNextPage();
        });
    }
    // console.log(propertyList);

    const handleInput = (e) => {
        const name = e.target.name;
        const value= e.target.value;
        //console.log(name, value);
        setAddProperty({...addProperty, [name] : value})
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(addProperty.propertyname && addProperty.description && addProperty.size ){

            const propertyname = propertynameRef.current.value;
            const description = descriptionRef.current.value;
            const size = sizeRef.current.value;
            base('property').create(
               {propertyname, description, size}, function (err, record){
                   if(err){
                       console.log(err);
                       return;
                   } else {
                       getData();
                   }
               }
            )
            setAddProperty({propertyname:"", description:"", size:""});

        } else {
            alert("please fill out all the fields")
        }
        
    };


    const deleteItems = (id) => {
        alert("are you sure you want to delete?");
        base("property").destroy(id, function( err, deleteItems){
            if(err){
                
                console.log(err);
                return;
            } else {
                // prompt("Delete Record", deleteItems.id);
                getData();
            }
        })
     };
    
    return (
        <>
        <div>
            <h1>Property Managment System</h1>
        </div>
        <div>
        <form onSubmit={handleSubmit} className="form">
            <div>
                <label htmlFor="propertyname">Property Name</label>
                <input type="text" autoComplete="off" ref={propertynameRef} value={addProperty.propertyname} onChange={handleInput} name="propertyname" id="propertyname" placeholder="Add propertyname..."  />
            </div>
            <div>
                <label htmlFor="description">Description</label>
                <textarea type="text" autoComplete="off" ref={descriptionRef} value={addProperty.description} onChange={handleInput} name="description" id="description" placeholder="Add description..." ></textarea>
            </div>
            <div>
                <label htmlFor="size">Size of Property</label>
                <input type="text" autoComplete="off" ref={sizeRef} value={addProperty.size} onChange={handleInput} name="size" id="size" placeholder="Add size..."  />
            </div>            

        <button type="submit">Add Property</button>
        </form>
        <table className="table">
        <thead>
            <tr>
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>SIZE</th>
                <th>Action</th>
            </tr>
        </thead> 
        <tbody>    
        { propertyList.map((val) => {
           return (
               <tr key={val.id}>
                   <td>{val.fields.propertyname}</td>
                   <td>{val.fields.description}</td>
                   <td>{val.fields.size}</td>
                   <td>
                   <button onClick={()=>{deleteItems(val.id)}}>Delete</button>
                   </td>
               </tr>
           )
           })
           }
        </tbody>
        </table>
        </div>
        </>
    )
}
