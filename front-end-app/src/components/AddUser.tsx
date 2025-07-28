import './AddUser.css'

function AddUser() {
    return (
        <div className='add-user-container'>
            <h1>Add User Page</h1>
            <div className='add-user-body'>
                <p>Customer Name</p>
                <input  type={'text'} name={'title'}></input>

                <p>Email</p>
                <input  type={'text'} name={'title'}></input>

                <p>Password</p>
                <input  type={'text'} name={'title'}></input>
            </div>
            <div className='add-user-buttons'>
                <button className='add-user-cancel-button'>Cancel</button>
                <button className='add-user-save-button'>Save</button>
            </div>
            
        </div>
    )
}

export default AddUser;