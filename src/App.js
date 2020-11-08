import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Chat from "./chat.js";



class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user : this.props.app.auth().currentUser,
      database : this.props.app.database,
      isLoggedIn : false,   
    }  
    
  } 
  componentDidMount(){         
    this.props.app.auth().onAuthStateChanged(function(user){
      if (user) {
        this.setState({isLoggedIn:true});
      } else {
        this.setState({isLoggedIn:false})
      }
    }.bind(this))    
  } 
  render() {
    if(this.state.isLoggedIn===true){
      return(<Chat app={this.props.app} database={this.state.database}/>)
    }  else {
      return(<MainPlaceholder app={this.props.app} />);
    }
  }
}

class MainPlaceholder extends React.Component {
  constructor(props){
    super(props);
    this.LoadNewUserForm = this.LoadNewUserForm.bind(this);
    this.LoadLoginForm = this.LoadLoginForm.bind(this);
  }
  LoadLoginForm(){
    ReactDOM.render(<LoginForm app={this.props.app}/>,document.getElementById('root'));
  }
  LoadNewUserForm(){
    ReactDOM.render(<NewUserForm app={this.props.app} user={this.props.app.auth().currentUser}/>,document.getElementById('root'));
  }
  render(){
    return(
      <div className="jumbotron jumbotron-fluid">
      <div className="container">
        <h1 className="display-4">Create New Account Or Log In</h1>
        <p className="lead">You`re not signed in yet. Click the button below</p>
        <div>
          <button className="btn" onClick={this.LoadNewUserForm}>Create New</button>
          <button className="btn" onClick={this.LoadLoginForm}>Log In</button>
        </div>
      </div>
    </div>)
  }
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      email : '',
      password:'',
      emailError:false,
      passwordError:false,
      formError:false, 
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange= this.handlePasswordChange.bind(this);
    this.renderMainPage = this.renderMainPage.bind(this);
    this.LogInUser = this.LogInUser.bind(this);
  }
  handleEmailChange(event) {
    this.setState({email:event.target.value},()=>{
      // eslint-disable-next-line
      let regExp = /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; 
      let result = regExp.test(this.state.email);
      if(result===true) {
          this.setState({emailError:false,formError:false});
        } else {
          this.setState({emailError:true,formError:true});
        }
      });    
  }
  handlePasswordChange(event){
    this.setState({password:event.target.value},()=>{
      // eslint-disable-next=line 
      let regExp = /^[a-zA-Z0-9_-]{6,18}$/; 
      let result = regExp.test(this.state.password); 
      if(result === true) {
        this.setState({passwordError:false, formError:false})
      } else {
        this.setState({passwordError:true,formError:true})
      }
    }); 
  }
  LogInUser(){ 
    if(this.state.formError!==true){
      this.props.app.auth().signInWithEmailAndPassword(this.state.email,this.state.password).catch(function(er){
        console.log(er.message)
      })    
    }
    ReactDOM.render(<App app={this.props.app}/>,document.getElementById('root'));
  }
  renderMainPage(){
    ReactDOM.render(<App app={this.props.app} />,document.getElementById('root'));
  }
    
  render(){
    return(
      <div className="form-group UserForm">
      <button className="btn" onClick={this.renderMainPage} id="backBtn">Back</button>
      <h1>Log in to your account</h1> 
      <div className="input-group mb-3">
        <label htmlFor="#LoginInput">Enter Your E-mail</label>
          <input type="text" id="EmailInput" placeholder="example@reenbit.com" 
          value={this.state.email} onChange={this.handleEmailChange}/> 
          <p>{this.state.emailError?"Wrong Email":""}</p>
      </div>
      <div className="input-group mb-3"> 
         <label htmlFor="#PasswordInput">Enter Your Password</label> 
          <input type="password" id="PasswordInput" placeholder="Password" 
          value={this.state.password} onChange={this.handlePasswordChange}/>
          <p>{this.state.passwordError?"Wrong Password":""}</p>
      </div> 
      <button className={`btn ${this.state.formError?"disabled":""}`} onClick={this.LogInUser}>Log In</button>
      </div>)
  }
}

class NewUserForm extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      email : '',
      password:'',
      emailError:false,
      passwordError:false,
      formError:false, 
    }
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange= this.handlePasswordChange.bind(this);
    this.renderMainPage = this.renderMainPage.bind(this);
    this.RegNewUser = this.RegNewUser.bind(this);
  }
  handleEmailChange(event) {
    this.setState({email:event.target.value},()=>{
      // eslint-disable-next-line
      let regExp = /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; 
      let result = regExp.test(this.state.email);
      if(result===true) {
          this.setState({emailError:false,formError:false});
        } else {
          this.setState({emailError:true,formError:true});
        }
      });    
  }
  handlePasswordChange(event){
    this.setState({password:event.target.value},()=>{
      // eslint-disable-next=line 
      let regExp = /^[a-zA-Z0-9_-]{6,18}$/; 
      let result = regExp.test(this.state.password); 
      if(result === true) {
        this.setState({passwordError:false, formError:false})
      } else {
        this.setState({passwordError:true,formError:true})
      }
    }); 
  }
  RegNewUser(){
    if(this.state.formError!==true) {
      this.props.app.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).catch(function(er){
      console.log(er.message);
      }) ;     
      ReactDOM.render(<App app={this.props.app} />,document.getElementById('root'));
      //this.props.app.auth().signInWithEmailAndPassword(this.state.email,this.state.password);
    }
  }
  renderMainPage(){
    ReactDOM.render(<App app={this.props.app} />,document.getElementById('root'));
  }
  render(){
    return(
    <div className="form-group UserForm">
    <button className="btn" onClick={this.renderMainPage} id="backBtn">Back</button>
    <h1>Create New User</h1> 
    <div className="input-group mb-3">
      <label htmlFor="#LoginInput">Enter Your E-mail</label>
        <input type="text" id="EmailInput" placeholder="example@reenbit.com" 
        value={this.state.email} onChange={this.handleEmailChange}/> 
        <p>{this.state.emailError?"Wrong Email":""}</p>
    </div>
    <div className="input-group mb-3"> 
       <label htmlFor="#PasswordInput">Enter Your Password</label> 
        <input type="password" id="PasswordInput" placeholder="Password" 
        value={this.state.password} onChange={this.handlePasswordChange}/>
        <p>{this.state.passwordError?"Wrong Password":""}</p>
    </div> 
    <button className={`btn ${this.state.formError?"disabled":""}`} onClick={this.RegNewUser}>Create New</button>
    </div>)
  }
}






export default App; 