import { PostItem,PostID } from "../interfaces/fetchApi";

const url = 'https://jsonplaceholder.typicode.com';



export const fetchItems = async ():Promise<PostItem[]> => {
    const response = await fetch(`${url}/posts`);
    const data:PostItem[] = await response.json();
    
    return data;
}

export const fetchPostItems = async(postID:number):Promise<PostID[]>=>{

    const response = await fetch(`${url}/comments?postId=${postID}`)

    const data:PostID[] = await response.json()

    return data

}

export const deletePost = async(postID:number):Promise<PostID[]>=>{
    const response = await fetch(`${url}/postId/${postID}`,{
        method:'DELETE'
    })

    const data:PostID[] = await response.json()

    return data
}

type Post = {
    title:string,
}

export const updatePost = async(postID:number,post:Post):Promise<PostID[]>=>{
    const response = await fetch(`${url}/postId/${postID}`,{
        method:'PATCH',
        headers:{
            'Content-type':'application/json; charset=UTF-8'
        },
        body:JSON.stringify(post)
    })

    const data:PostID[] = await response.json()

    return data
}