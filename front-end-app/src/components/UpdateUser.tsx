import './UpdateUser.css';

function UpdateUser() {
    return (
        <div className='update-user-container'>
            <h1>Update User Page</h1>
            <div className='update-user-body'>
                <p>Customer Name</p>
                <input  type={'text'} name={'title'}></input>

                <p>Email</p>
                <input  type={'text'} name={'title'}></input>

                <p>Password</p>
                <input  type={'text'} name={'title'}></input>
            </div>
            <div className='update-user-buttons'>
                <button className='update-user-cancel-button'>Cancel</button>
                <button className='update-user-save-button'>Save</button>
                <button className='update-user-delete-button'>Delete</button>
            </div>
            
        </div>
    )
}

export default UpdateUser;