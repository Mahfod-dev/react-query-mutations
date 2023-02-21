import { useState,useEffect } from "react"
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query"
import { fetchItems,fetchPostItems,deletePost,updatePost } from "../api/fetchItems"
import { PostItem } from "../interfaces/fetchApi"



export const PostItemList = () => {

  const queryClient = useQueryClient()

const {data, isLoading,error} = useQuery<PostItem[]>(['posts'],
fetchItems)

const prefetchTodos = async () => {
  // The results of this query will be cached like a normal query
  await queryClient.prefetchQuery({
    queryKey: ['todos'],
    queryFn: fetchItems,
  })
}

useEffect(()=>{
    prefetchTodos()
},[])



if(error instanceof Error){
    return <>
    <h3>
         Opps something went wrong
    </h3>
        <p>{error.toString()}</p>
   </>
}

return (
    <>

        {
            isLoading ? <h1>Loading...</h1>  : data?.slice(0,10).map((item) => (
                <ListItems key={item.id} items={item}/>
            ))
            
        }
       


    </>


  )
}

type ListItemsProps={
    items: PostItem
}


export const ListItems = ({items}:ListItemsProps)=>{

    const [selectedPost, setSelectedPost] = useState<PostItem>();
    const [toggle,setToggle] = useState(false)

return (
    <>
		<ul style={{listStyle:'none'}}>
			<li onClick={() =>{
            setSelectedPost(items);
            setToggle(!toggle)
            } }>
				<p>{items.title}</p>
			</li>
		</ul>

        {selectedPost && <PostDetail post={selectedPost} toggle={toggle}/>}

</>
  );
}

const Buttons = ({postID}:{postID:number})=>{
  

const deleteMutation = useMutation((postID:number)=>deletePost(postID),{
    onSuccess:()=>{
        console.log('delete success')
    }
})

const updateMutation = useMutation((postID:number)=>updatePost(postID,
  {title:"hello je suis une mutation"} ),{
    onSuccess:()=>{
        console.log('update success')
    }
})



    return (
		<div>
		
			<button  onClick={() => {
                deleteMutation.mutate(postID)
            }}>
				Delete
			</button>
			
			<button onClick={() => updateMutation.mutate(postID)}>
                Edit
			</button>
		</div>
	); 

}

const PostDetail =({post,toggle}:{post:PostItem,toggle:Boolean})=>{
    
   const {data, isLoading,error} = useQuery(['comments',post.id],
()=> fetchPostItems(post.id))   





if(isLoading) return <h1>Loading...</h1>
if(error instanceof Error) return <h1>Opps something went wrong {error.toString()}</h1>


return <div style={{border:'1px solid red'}}>
{toggle && <div style={{color:'yellow'}}><h4>{post.title}</h4> <p>{post.body}</p></div>}
    {toggle &&
        data?.map((item)=>(
            <li key={item.id}>
               {item.email} {item.body}
            </li>))
    }
    <Buttons postID={post.id}/>
</div>

}

