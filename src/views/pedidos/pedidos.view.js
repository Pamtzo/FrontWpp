import React from "react";
import './pedidos.css'

import logo from '../../logo.png';
import logo2 from '../../logo2.png';
import logimg from '../../logimg.png';
import {
    Card, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Input
  } from 'reactstrap';

function SetInfo({person, sell}) {
    return (
        <Card>
            <CardBody>
                <CardTitle><b>Pedido #{person.id}</b></CardTitle>
                <CardSubtitle><b>Datos del cliente</b></CardSubtitle>
                <CardText>
                    {person.name} <br/>
                    {person.direction} <br/>
                    {person.cellphone} <br/>
                </CardText>
                <CardSubtitle><b>Detalle del pedido</b></CardSubtitle>
                <CardText>{person.delivery}</CardText>
                <Button color="success" size="sm" block={true} onClick={()=>sell(person.id, person.cellphone)}>
                    <div className="dispatch">DESPACHAR PEDIDO</div>
                </Button>
            </CardBody>
        </Card>
    )
}

class Pedido extends React.Component{
    constructor(props){
        super(props);
        this.sell = this.sell.bind(this);
        this.get_info = this.get_info.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.register = this.register.bind(this);
    }

    state={
        block:true,
        isRegister:false,
        user:'',
        password:'',
        cellphone:'',
        sucursal: '',
        pedidos:[],
        Ruser:'',
        Rpassword:'',
        Rnumber:'',
        Rsucursal:''
    }

    async sell(key, name){
        try{
            const response = await fetch(
              `http://167.71.145.103/code/?code=2`,
              {
                  method: 'POST',
                  body: JSON.stringify({pk:key, contact:name, cellphone:this.state.cellphone})
              }
            );
            await response.json();
            this.get_info()
        } catch (error){
        }
    }

    async login(){
        try{
            const response = await fetch(
              `http://167.71.145.103/code/?code=5&user=${this.state.user}&password=${this.state.password}`
            );
            const data = await response.json();
            if (data.state){
                this.setState({
                    sucursal:data.sucursal,
                    cellphone:data.cellphone,
                    block: false
                });
            }
            else{
                alert("Usuario o contraseña incorrecto")
            }
          } catch (error){
          }
    }

    async register(){
        try{
            const response = await fetch(
                `http://167.71.145.103/code/?code=4`,
                {
                    method: 'POST',
                    body: JSON.stringify({form:{user:this.state.Ruser, password:this.state.Rpassword, cellphone:this.state.Rnumber, sucursal:this.state.Rsucursal}})
                }
            );
            const data = await response.json();
            console.log(data)
            this.setState({
                Rpassword:'',
                isRegister:false,
                Rnumber:'',
                Rsucursal:'',
                Ruser:''
            });
            alert("Registro exitoso")
          } catch (error){
          }
    }

    logout(){
        this.setState({
            block:true,
            user:'',
            password:'',
            cellphone:'',
            sucursal: '',
            pedidos:[]
        })
    }

    async get_info(){
        if (!this.state.block){
            try{
                const response = await fetch(
                `http://167.71.145.103/code/?code=2&sucursal=${this.state.sucursal}&cellphone=${this.state.cellphone}`
                );
                const data = await response.json();
                this.setState({
                    pedidos:data.pedidos
                });
            } catch (error){
            }
        }
    }

    passLogin(){
        this.setState({
            isRegister: true
        })
    }

    passRegister(){
        this.setState({
            isRegister:false
        })
    }

    onHandleChange = evt =>{
        this.setState({[evt.target.name]:evt.target.value})
    }

    componentDidMount(){
        setInterval(()=>this.get_info(), 5000)
    }

    onChange= evt=>{
        this.setState({[evt.target.name]:evt.target.value})   
    }

    render(){
        return(
            <div className="App">
                {this.state.block &&
                <div className="delivery">
                    <div className="Header2">
                        <img src={logo2} alt="Logo2" className="Logo2"/>
                    </div>
                    <div className="Row">
                        <img src={logimg} alt="Logo2" className="Logimg"/>
                        {!this.state.isRegister && <div className="LogForm">
                            <div className="Tittle1">¡Bienvenido!<br/></div>
                            <div className="Sub1">Inicia sesión para empezar a recibir pedidos</div>
                            <div className="info">Usuario</div>
                            <Input className="data" placeholder="Ej. juan26" name="user" onChange={this.onChange}></Input>
                            <div className="info">Contraseña</div>
                            <Input className="data" type="password" name="password" onChange={this.onChange}></Input>
                            <Button color="success" onClick={this.login} block={true} size="sm">
                                <div className="dispatch" >INGRESAR</div>
                            </Button>
                            <Button outline color="info" block={true} size="sm" onClick={()=>this.passLogin()}>
                                <div className="dispatch Generate">REGISTRAR</div>
                            </Button>
                            <div className="Title2">Ey!<br/></div>
                            <div className="SubLog2">¿Quieres usar nuestras herramientas?</div>
                            <div className="Title2 succ">¡Contactanos!<br/></div>
                        </div>}
                        {this.state.isRegister && <div className="LogForm">
                            <div className="Tittle1">¡Registro!<br/></div>
                            <div className="Sub1">Llena el formulario para poder registrarte</div>
                            <div className="info">Usuario</div>
                            <Input className="data" placeholder="Ej. sayovictoria" name="Ruser" onChange={this.onChange}></Input>
                            <div className="info">Numero</div>
                            <Input className="data" placeholder="Ej. 3209874152" name="Rnumber" onChange={this.onChange}></Input>
                            <div className="info">Nombre sucursal</div>
                            <Input className="data" placeholder="Ej. victoria" name="Rsucursal" onChange={this.onChange}></Input>
                            <div className="info">Contraseña</div>
                            <Input className="data" type="password" name="Rpassword" onChange={this.onChange}></Input>
                            <Button color="success" block={true} size="sm" onClick={this.register}>
                                <div className="dispatch" >REGISTRAR</div>
                            </Button>
                            <Button outline color="info" block={true} size="sm"onClick={()=>this.passRegister()} >
                                <div className="dispatch Generate">CANCELAR</div>
                            </Button>
                        </div>}
                    </div>
                </div>}
                {!this.state.block &&
                <div className="delivery">
                    <div className="Header3">
                        <img src={logo} alt="Logo1" className="Logo1"/>
                        <div className="LogOut" onClick={this.logout}>Cerrar sesión</div>
                    </div>
                    <div className="Tittle1">Pedidos entrantes<br/></div>
                    <div className="SubLog">Todos los pedidos tomados a través del chat center los verás en esta pantalla</div>
                    <ul className="Row"> 
                        {this.state.pedidos.map(person => (
                            <li key={person.id}>
                                <SetInfo person={person} sell={this.sell}/>
                            </li>
                            )
                        )}
                    </ul>
                </div>}
            </div>
        )
    }
 }

 export default Pedido