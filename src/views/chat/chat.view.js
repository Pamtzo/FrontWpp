import React from "react";
import './chat.css';
import logo from '../../logo.png';

import { Button, Input } from 'reactstrap';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SetInfo({person, update}) {
    return (
        <Button color="info" block={true} size='lg' onClick={()=>update(person.name)}>
            <div className="Contact">{person.name}</div>
        </Button>
    )
}

function SetMessages({message}) {
    return (
        <div className="text" style={{float: `${message.align}`, textAlign: `${message.align}`, backgroundColor: `${message.background}`, color: `${message.color}` }}>
            <div className="content">{message.text}</div>
        </div>
    )
}

class Form extends React.Component{

    render(){
        return(
            <div className="Column Column3">
                <div className="Form">
                    <span className="Tittle1">Datos del cliente y pedido<br/></span>
                    <span className="Sub1">La proxima vez que escriban estará diligenciado</span>
                    <div className="Chat">
                        <div className="info">Nombre completo</div>
                        <Input className="data" value={this.props.form.client} name="client" placeholder="Ej. Diego Naranjo" onChange={this.props.onChange}></Input>
                        <div className="info">Nro. de teléfono</div>
                        <Input className="data" value={this.props.form.cellphone} name="cellphone" placeholder="Ej. +57 320 8917575" onChange={this.props.onChange}></Input>
                        <div className="info">Dirección</div>
                        <Input className="data" value={this.props.form.direction} name="direction" placeholder="Ej. Av. Juan B. Gutierrez #22-12"onChange={this.props.onChange}></Input>
                        <div className="info">Sucursal de atención</div>
                        <Input className="data" value={this.props.form.sucursal} name="sucursal" placeholder={this.props.form.sucursal} onChange={this.props.onChange}></Input>
                        <div className="info">Valor del pedido</div>
                        <Input className="data" value={this.props.form.value} name="value" placeholder="Ingresa el valor del pedido" onChange={this.props.onChange} type="number"></Input>
                        <div className="info">Detalle del pedido</div>
                        <textarea className="data delivery" value={this.props.form.delivery} name="delivery" placeholder="Ingresa el pedido aquí"onChange={this.props.onChange}></textarea>
                        <Button block={true} size="sm" color="success" onClick={this.props.send_delivery}>
                            <div className="Dispatch">DESPACHAR</div>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

class Chat extends React.Component{
    constructor(props){
        super(props);
        this.get_messages = this.get_messages.bind(this);
        this.get_contacts = this.get_contacts.bind(this);
        this.get_last_pedido = this.get_last_pedido.bind(this);
        this.update = this.update.bind(this);
        this.send_message = this.send_message.bind(this);
        this.send_delivery = this.send_delivery.bind(this);
        this.logOut = this.logOut.bind(this);
    } 

    state={
        block: true,
        cellphone:'',
        Qr: '',
        contact: 'andres',
        message: '',
        contacts:[{id:1, name:"andres"}],
        messages:[{id:1, align:"left", text:"Buenas tardes", color:"black", background:"white"},{id:2, align:"right", text:"Buenas tardes señor andres que se le puede ofrecer", color:"white", background:"purple"},
        {id:3, align:"left", text:"3 combos 5 por favor", color:"black", background:"white"},{id:4, align:"right", text:"se añadieron 3 combos 5", color:"white", background:"purple"},
        {id:6, align:"right", text:"desea añadir una gaseosa?", color:"white", background:"purple"},
        {id:7, align:"left", text:"no muchas gracias eso seria todo", color:"black", background:"white"},{id:8, align:"right", text:"en ese caso tendria un coste de 50000 pesos", color:"white", background:"purple"},
        {id:9, align:"left", text:"listo, mi direccion es Cra 6A", color:"black", background:"white"},{id:10, align:"right", text:"listo su pedido ha sido realizado", color:"white", background:"purple"},
        {id:11, align:"left", text:"muchas gracias", color:"black", background:"white"}],
        form:{client:'andres', direction:'Cra 6A#41A-33', sucursal:'Victoria', delivery:'Combo #5 X3', cellphone:'+57 310 3589575', value:50000}
    }

    async get_last_pedido(contact){
        try{
            const response = await fetch(
              `http://167.71.145.103/code/?code=4&contact=${contact}&cellphone=${this.state.cellphone}`
            );
            const data = await response.json();
            this.setState({
                form:data.form
            });
          } catch (error){
        } 
    }

    async get_Qr(){
        try{
            const response = await fetch(
            `http://167.71.145.103/code/?code=0&cellphone=${this.state.cellphone}`
            );
            const data = await response.json();
            if (data.state){
                this.setState({
                    Qr:data.Qr
                });
            }
            else{
                alert("El numero dado no es correcto")
            }
        } catch (error){
        }
    }

    async login(){
        try{
            const response = await fetch(
            `http://167.71.145.103/code/?code=6&cellphone=${this.state.cellphone}`
            );
            const data = await response.json();
            if (data.state){
                this.setState({block:false, Qr:''})
            }
            else{
                alert("El numero dado no es correcto")
            }
        } catch (error){
            this.setState({block:false, Qr:''})
        }
    }

    async get_messages(contact){
        if(this.state.block){}
        else{
            try{
                const response = await fetch(
                `http://167.71.145.103/code/?code=1&cellphone=${this.state.cellphone}&contact=${contact}`
                );
                const data = await response.json();
                this.setState({
                    contact:contact,
                    messages:data.messages
                });
            } catch (error){
                //alert("Hubo un error inesperado, porfavor vuelva a escanear el Qr")
                //this.setState({block:true})
            }
        }
    }

    update(contact){
        this.get_messages(contact)
        this.get_last_pedido(contact)
    }

    async get_contacts(){
        if(this.state.block){}
        else{
            try{
                const response = await fetch(
                `http://167.71.145.103/code/?code=3&cellphone=${this.state.cellphone}`
                );
                const data = await response.json();
                this.setState({
                    contacts:data.contacts
                });
            } catch (error){
                //alert("Hubo un error inesperado, porfavor vuelva a escanear el Qr")
                //this.setState({block:true})
            }
        }
    }

    handleChange=evt=> {
        const value = evt.target.value;
        const newform = {...this.state.form,[evt.target.name]: value}
        this.setState({
            form:newform
        });
    }

    async send_message(){
        try{
            const response = await fetch(
              `http://167.71.145.103/code/?code=1`,
              {
                  method: 'POST',
                  body: JSON.stringify({cellphone:this.state.cellphone, contact:this.state.contact, message:this.state.message})
              }
            );
            this.setState({message:''})
            await response.json();
            this.get_messages(this.state.contact)
        } catch (error){
            //alert("Hubo un error inesperado, porfavor vuelva a escanear el Qr")
            //this.setState({block:true})
        }
    }

    componentDidMount(){
        //setInterval(()=>this.get_contacts(), 3000)
        //setInterval(()=>this.get_messages(this.state.contact), 3000)
    }

    onChangemessage=evt=>{
        this.setState({[evt.target.name]:evt.target.value})   
    }

    logOut(){
        this.setState({
            block: true,
            cellphone:'',
            Qr: '',
            contact: '',
            message: '',
            contacts:[],
            messages:[],
            form:{client:'', direction:'', sucursal:'', delivery:'', cellphone:'', value:0}
        })
    }

    async send_delivery(){
        try{
            const response = await fetch(
              `http://167.71.145.103/code/?code=3`,
              {
                  method: 'POST',
                  body: JSON.stringify({form:this.state.form, cellphone:this.state.cellphone})
              }
            );
            this.setState({
                form:{client:'', direction:'', sucursal:'', delivery:'', cellphone:'', value:0}
            })
            await response.json();
            this.get_contacts()
        } catch (error){
            //alert("Hubo un error inesperado, porfavor vuelva a escanear el Qr")
            //this.setState({block:true})
        }
    }

    render(){
        return(
            <div className="App">
                {!this.state.block &&
                <div className="Login">
                    <div className="Header">
                        <img src={logo} alt="Logo" className="Logo"/>;
                        <span className="LogOut" onClick={()=>this.logOut()}>Cerrar sesión</span>
                    </div>
                    <div className="Row">
                        <div className="Column Column1">
                            <span className="Tittle1">Conversaciones activas<br/></span>
                            <span className="Sub1">Todas tus conversaciones encoladas</span>
                            <div className="Chat">
                                <ul>
                                    {this.state.contacts.map(person => (
                                        <li className="full" key={person.id}>
                                            <SetInfo person={person} update={this.update}/>
                                        </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="Column Column2">
                            <span className="Tittle1">Chat activo<br/></span>
                            <div className="Sub2">{this.state.contact}</div>
                            <div className="Chat">
                                <ul>
                                    {this.state.messages.map(message => (
                                        <li className="full" key={message.id}>
                                            <SetMessages message={message}/>
                                        </li>
                                        )
                                    )}
                                </ul>
                            </div>
                            <div className="send_message">
                                <Input value={this.state.message} placeholder="Ingrese texto aqui" className="message" name="message" onChange={this.onChangemessage}></Input>
                                <button className="send" onClick={this.send_message}>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        </div>
                        <Form form={this.state.form} onChange={this.handleChange} send_delivery={this.send_delivery}/>
                    </div>
                </div>}
                {this.state.block &&
                <div className="Login">
                    <div className="Header">
                        <img src={logo} alt="Logo" className="Logo Centericon"/>
                    </div>
                    <span className="Tittle1">Bienvenido al chat center<br/></span>
                    <div className="SubLog">Ingresa tu número y dale a tus clientes la atención que merecen</div>
                    <div className="Log">
                        <img className="Qr"  alt="" src={`data:image/jpeg; base64,${this.state.Qr}`}/>
                        <div className="info">Número de celular</div>
                        <Input className="data Number" name="cellphone" placeholder="Ingresa el número de celular" onChange={this.onChangemessage}></Input>
                        <Button color="ligth" block={true} size="sm" onClick={()=>this.get_Qr()}>
                            <div className="Dispatch Generate">Generar código QR</div>
                        </Button>
                        <Button color="success" size="sm" block={true} onClick={()=>this.login()}>
                            <div className="Dispatch" >INGRESAR</div>
                        </Button>
                    </div>
                </div>}
            </div>
        )
    }
}

 export default Chat