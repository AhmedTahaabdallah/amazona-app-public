import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoadingBox from '../../components/UI/LoadingBox/LoadingBox';
import MessageBox from '../../components/UI/MessageBox/MessageBox';
import * as actions from '../../store/actions/index';
import { initAllLoading } from '../../shared/utility';
import SweetAlert from 'react-bootstrap-sweetalert';

const UsertListScreen = props => {
    const [ deleteUserIdName, setDeleteUserIdName ] = useState(null);
    const [ editUserData, setEditUserData ] = useState(null);
    const [ currentPageNumber, setCurrentPageNumber ] = useState(1);
    
    const userData = useSelector(state => state.user);
    const { 
        user, users, usersLoading, usersError, usersMsg,
        deleteLoading, deleteError, deleteMsg,
        updateLoading, updateError, updateMsg,
        loadMore, pages, page
    } = userData;

    const dispatch = useDispatch();
    const onResetDeleteUserMsgError = () => dispatch(actions.resetDeleteUserMsgError());
    const onResetUpdateUserProfileMsgError = () => dispatch(actions.resetUpdateUserProfileMsgError());
    const onShowSuccessSnackbar = (msg) => dispatch(actions.showSuccessSnackbar(msg));
    const onShowErrorSnackbar = (msg) => dispatch(actions.showErrorSnackbar(msg));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if(!user) {
            props.history.push(`/signin?redirect=userlist`);
        }    
        if(updateError) {
            onShowErrorSnackbar(updateMsg);
            onResetUpdateUserProfileMsgError();
        } else if(!updateError && updateMsg) {
            onShowSuccessSnackbar(updateMsg);
            setEditUserData(null);
            onResetUpdateUserProfileMsgError();
        } 

        if(deleteError) {
            onShowErrorSnackbar(deleteMsg);
            onResetDeleteUserMsgError();
        } else if(!deleteError && deleteMsg) {
            onShowSuccessSnackbar(deleteMsg);
            setDeleteUserIdName(null);
            onResetDeleteUserMsgError();
        } 
        if(usersError) {
            setCurrentPageNumber(page);
        }
    });

    useEffect(() => {    
        if(user && user.isAdmin) {              
            initAllLoading(dispatch, 'intiUsersList');
            dispatch(actions.listUsers({}));
        }      
    }, [ dispatch, user ]);

    const showEditDailogHandler = (userDataa) => {
        setEditUserData(userDataa);
    };

    const updateHandler = () => {
        dispatch(actions.editUser(editUserData));        
    };  

    const showDeleteDailogHandler = (userIdName) => {
        setDeleteUserIdName(userIdName);
    };    

    const deleteHandler = () => {
        dispatch(actions.deleteUser(deleteUserIdName.id));        
    };    
    
    let usersList = null;
    if(user && !user.isAdmin) {
        usersList = <MessageBox>You Dont't have permison to show Users List, please login as admin user.</MessageBox>;
    } else if(usersLoading && !loadMore) {
        usersList = <LoadingBox />;
    } else if(usersError && usersMsg) {
        usersList = <MessageBox variant='danger'>{usersMsg}</MessageBox>;
    } else if(users.length === 0) {
        usersList = <MessageBox>There is no Users.</MessageBox>;
    } else {
        usersList = (
            <div>
                {editUserData && <SweetAlert
                warning
                title="Edit User"    
                onConfirm={() => {}} 
                onCancel={() => {}}
                customButtons={
                    <React.Fragment>
                      <button 
                      type='button' 
                      className='small delete'
                      onClick={() => {
                          setEditUserData(null);;
                      }}>Cancel</button>
                      <button 
                      style={{
                            margin: '0 8px'
                        }}
                      type='button' 
                      className='small edit'
                      onClick={updateHandler}>
                          {updateLoading ? <i style={{margin: '0 16px'}} className="fa fa-spinner fa-spin"></i> : 'Update'}
                    </button>
                    </React.Fragment>
                  }        
                >                
                <div style={{
                    display: 'inline-flex',
                    margin: '2rem 1.5rem'
                }}>
                    <div>
                        <input 
                        id='isAdmin'
                        type='checkbox'
                        checked={editUserData.isAdmin}
                        onChange={e => setEditUserData({
                            id: editUserData.id,
                            isAdmin: e.target.checked,
                            isSeller: editUserData.isSeller,
                        })}
                        />
                        <label htmlFor='isAdmin'>Is Admin</label>
                    </div>
                    <div style={{
                        width: '3.5rem'
                    }}></div>
                    <div>
                        <input 
                        id='isSeller'
                        type='checkbox'
                        checked={editUserData.isSeller}
                        onChange={e => setEditUserData({
                            id: editUserData.id,
                            isSeller: e.target.checked,
                            isAdmin: editUserData.isAdmin,
                        })}
                        />
                        <label htmlFor='isSeller'>Is Seller</label>
                    </div>
                </div>
                </SweetAlert>}
                {deleteUserIdName && <SweetAlert
                warning
                title="User Delete"    
                onConfirm={() => {}} 
                onCancel={() => {}}
                customButtons={
                    <React.Fragment>
                      <button 
                      type='button' 
                      className='small edit'
                      onClick={() => {
                          setDeleteUserIdName(null);;
                      }}>Cancel</button>
                      <button 
                      style={{
                            margin: '0 8px'
                        }}
                      type='button' 
                      className='small delete'
                      onClick={deleteHandler}>
                          {deleteLoading ? <i style={{margin: '0 16px'}} className="fa fa-spinner fa-spin"></i> : 'Delete'}
                    </button>
                    </React.Fragment>
                  }        
                >
                Are you sure to delete {deleteUserIdName.name} ?
                </SweetAlert>}
                <div className='row'>
                    <h1>Users</h1>
                </div>
                <table className='table list-users-table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Seler</th>
                            <th>Is Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {                        
                        loadMore ?
                        null                       
                        : (<tbody>
                            {users.map(userr => {
                                return (
                                    <tr key={userr._id}>
                                        <td>{userr._id}</td>
                                        <td><img src={userr.image} alt={userr.name} className='small-image'/></td>
                                        <td>{userr.name}</td>
                                        <td>{userr.email}</td>
                                        <td>{userr.isSeller ? 'Yes' : 'No'}</td>
                                        <td>{userr.isAdmin ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button
                                            type='button'
                                            className='small edit'
                                            onClick={() => showEditDailogHandler({ id: userr._id, isAdmin: userr.isAdmin, isSeller: userr.isSeller})}
                                            >Edit</button>
                                            <button
                                            type='button'
                                            className='small delete'
                                            onClick={() => showDeleteDailogHandler({id: userr._id,name: userr.name})}
                                            >Delete</button>                                        
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>)
                    }
                </table>
                {
                    loadMore && (
                        <div
                        style={{
                            marginTop: '4.5rem',
                            marginBottom: '4.5rem'
                        }}
                        className='row center'>
                            <i className="fa fa-spinner fa-spin pagination-loading"></i>
                        </div>
                    )
                }
                <div 
                style={{
                    marginTop: '1.5rem'
                }}
                className='row center pagination'>
                    <div>
                        {
                            [...Array(pages).keys()].map(x => (
                                <button 
                                className={Number(x + 1) === Number(currentPageNumber) ? 'select-page' : ''}
                                key={x}
                                type='button'
                                onClick={() => {
                                    setCurrentPageNumber(x + 1);
                                    dispatch(actions.listUsers({ 
                                        pageNumber: x + 1,
                                        loadMore:  true
                                    }));                                   
                                }}
                                >
                                    {x + 1}
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
    return usersList;
};

export default UsertListScreen;