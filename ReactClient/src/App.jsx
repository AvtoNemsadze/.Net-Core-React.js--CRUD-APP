import { useState } from 'react'
import Constants from './utils/Constants';
import PostCreateForm from './components/PostCreateForm';
import PostUpdateForm from './components/PostUpdateForm';


function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreatedNewPostForm, setShowingCreatedNewPostForm] = useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] = useState(null);

  function getPosts(){
    const url = Constants.API_URL_GET_ALL_POSTS;

    fetch(url, {method:'GET'})
    .then(response => response.json())
    .then(postsFromServer => {
      setPosts(postsFromServer);
    })
    .catch((error)=> {
      console.log(error);
    })
  }

  function deletePost(postId){
    const url =`${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;

    fetch(url, {method:'DELETE'})
    .then(response => response.json())
    .then(responseFromServer => {
      console.log(responseFromServer);
      onPostDeleted(postId);
    })
    .catch((error)=> {
      console.log(error);
    })
  }

  
  return (
    <div className="container mb-4 mt-4">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">
        {(showingCreatedNewPostForm === false && postCurrentlyBeingUpdated === null) && (

          <div>
            <h1>ASP.Net Core React app</h1>

            <div className='mt-5'>
              <button className='btn btn-dark btn-lg w-100' onClick={getPosts}>Get Posts From Server</button>
              <button className='btn btn-success btn-lg w-100 mt-4' onClick={()=> setShowingCreatedNewPostForm(true)}>Create New Post</button>
            </div>
          </div>
        )}

          {(posts.length > 0 && showingCreatedNewPostForm === false && postCurrentlyBeingUpdated === null) && renderPostTable()}

          {showingCreatedNewPostForm && <PostCreateForm onPostCreated={onPostCreated} />}

          {postCurrentlyBeingUpdated !== null && <PostUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />}

        </div>
      </div>
    </div>
  )

  function renderPostTable(){
    return(
      <div className='table-responsive mt-5'>
        <table className='table table-bordered border-dark'>
          <thead>
            <tr>
              <td scope="col">PostId (PK)</td>
              <td scope="col" style={{minWidth:'200px'}}>Title</td>
              <td scope="col">Content</td>
              <td scope="col">CRUD Operation</td>
            </tr>
          </thead>

          <tbody>
            {posts.map((post)=> (
                <tr key={post.postId}>
                  <th scope="row">{post.postId}</th>
                  <td>{post.title}</td>
                  <td>{post.content}</td>
                  <td>
                    <button onClick={()=> setPostCurrentlyBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                    <button onClick={()=> {if(window.confirm(`Are you sure, you want to delete ${post.title}?`)) deletePost(post.postId)}} className='btn btn-danger btn-lg'>Delete</button>
                  </td>
              </tr>
              ))}
          </tbody>
        </table>

        <buttton onClick={()=> setPosts([])} className="btn btn-secondary btn-lg w-100" >Clear All Posts</buttton>
      </div>
    )
  }

  function onPostCreated(createdPost){
    setShowingCreatedNewPostForm(false);

    if(createdPost === null){
      return;
    }
    // alert(`Post Successfully Created, After clicking Ok, your new post titled "${createdPost.title}" will show up in the table below`);
    getPosts();
  }

  function onPostUpdated(updatedPost){
    setPostCurrentlyBeingUpdated(null)

    if(updatedPost === null){
      return null;
    }

    let postsCopy = [...posts];
    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if(postsCopyPost.postId === updatedPost.postId){
        return true;
      }
    });

    if(index !== -1){
      postsCopy[index] = updatedPost;
    }

    setPosts(postsCopy);
    alert('post successfully updated, after click ok')
  }

  function onPostDeleted(deletedPostPostId){

    let postsCopy = [...posts];

    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if(postsCopyPost.postId === deletedPostPostId){
        return true;
      }
    });

    if(index !== -1){
      postsCopy.splice(index, 1);
    }

    setPosts(postsCopy);
  }
}

export default App