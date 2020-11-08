import React from 'react';
import ReactDOM from 'react-dom';
import  App from './App.js';
import "./chat.css";

class Chat extends React.Component{
    constructor(props){
        super(props);
        this.state = {
           user : this.props.app.auth().currentUser, 
           haveContact :false,
        }
        this.addFriend = this.addFriend.bind(this);
        this.LoadContactList = this.LoadContactList.bind(this);
    } 
    componentDidMount(){
        this.ContactCheck();
    }   
    ContactCheck() {
        if(localStorage.length===0){
           this.setState({haveContact:false})
        } else {
            this.setState({haveContact:true});
        }
    }
    addFriend(){
        let name = prompt("Enter Friend Name","...");
        localStorage.setItem(this.state.user.uid+"_"+name,name);
        localStorage.setItem(this.state.user.uid+"_"+name+"id",Math.floor(Math.random()*1000))
        let names = localStorage.getItem(this.state.user.uid+'names');
        if(names!==null){
        localStorage.setItem(this.state.user.uid+"names",names+";"+name)}
        else {
            localStorage.setItem(this.state.user.uid+"names",name)
        }
        ReactDOM.render(<Chat app={this.props.app} />,document.getElementById('root'));
    }
    LoadContactList(){
        let data =  localStorage.getItem(this.state.user.uid+"names");
        let dataArray = data.split(";");
        let res =dataArray.map(function(item){
            let name = localStorage.getItem(this.state.user.uid+"_"+item);
            let id = localStorage.getItem(this.state.user.uid+"_"+item+"id");
            return(<Contact name={name} id={id} app={this.props.app}/>)
        }.bind(this))
        return res;
    }
    renderContactList(){
        if(this.state.haveContact===false){
            return(<button onClick={this.addFriend}>Add Friend</button>)
        } else {
            return(<div><button onClick={this.addFriend}>Add Friend</button>
                <div>{this.LoadContactList()}</div></div>)
        }
    }
    LoadMessages(){
       let msg =  localStorage.getItem(this.props.contactId+"msg");
       
       if(msg===null){
           return(<div>Write your first message</div>)
       } else {
           let array = msg.split(";");
           let idx = 0; 
           let res = array.map(function(item){
            if(idx%2===1){
                idx++;
                return(<Messages float={"right"} text={item}  />)
            } else {
                idx++;
                return(<Messages float={"left"} text={item} />)
            }
           })
        return(<div>{res}</div>)
       }
    }
    render(){
    return(
    <div className="row container-fluid">
        <div className="col-4" >
        <div className="searchBar"> 
            <img src="https://medgoldresources.com/wp-content/uploads/2018/02/avatar-placeholder.gif" alt="Avatar"/>
            <input type="search" placeholder="Search" />            
        </div>
        <br/>
        <div className="contactList">
            <h4>Chats</h4>
           {this.renderContactList()}
        </div>
        </div>
        <div className="col-8">
            <div >  
            <div className="chatHeader">
               <h4> {this.props.contactName}</h4>
            </div>
               <div className="messageArea">
                <div>
                {this.LoadMessages()}
                </div>
                <MessagesInput contactName={this.props.contactName} contactId={this.props.contactId} app={this.props.app}/>
               </div>
            </div>
        </div>

    </div>);
    }
}


class Contact extends React.Component{
    LoadMessages(id){
        localStorage.getItem(id+"messages");
        ReactDOM.render(<Chat app={this.props.app} contactName={this.props.name} contactId={this.props.id} />,document.getElementById('root'));
    }
    render(){
    return(<div className="contact" onClick={()=>{this.LoadMessages(this.props.id)}}>
        {this.props.name}
    
        </div>)
    }
}


class Messages extends React.Component{
    render(){
    return(<div className={`msg ${this.props.float}`}>{this.props.text}</div>)
    }
}


class MessagesInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value : '',
            joke : '',
        }
        this.addNewMessage=this.addNewMessage.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
    }
    handleMessageChange(event){
        this.setState({value:event.target.value});
    }
    addNewMessage(){
        let msg = localStorage.getItem(this.props.contactId+"msg");
        if(msg===null){
            localStorage.setItem(this.props.contactId+"msg",this.state.value);
        } else {
            localStorage.setItem(this.props.contactId+"msg",msg+";"+this.state.value);
            ///тут ще треба таймаут поставити!!
            fetch("https://api.chucknorris.io/jokes/random")
            .then(result => result.json())
            .then(res => this.setState({joke: res.value}))
            localStorage.setItem(this.props.contactId+"msg",msg+";"+this.state.value+";"+this.state.joke);

        }
        ReactDOM.render(<Chat contactName={this.props.contactName} contactId={this.props.contactId} app={this.props.app} />,document.getElementById('root'))
    }
    render(){
        if(this.props.contactName===null)
        {return(null)}
        else {
            return(
            <div className="msgInput">
            <input type="text" value={this.state.value} onChange={this.handleMessageChange}></input>
            <button type="button" onClick={this.addNewMessage}>Send</button>
            </div>)
        }
    }
}

export default Chat;