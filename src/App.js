import ReactGA from 'react-ga4'
import './App.css';
import { Component } from 'react';
import $ from "jquery";
import Header from './Components/Header';
import About from './Components/About';
import Contact from './Components/Contact';
import Resume from './Components/Resume';
import Porto from './Components/Porto';
import Footer from './Components/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state= {
      foo: "bar",
      resumeData: {}
    };

    ReactGA.initialize("G-EDSBVJ3C0F");
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });

  }

  getResumeData(){
    $.ajax({
      url: "./resumeData.json",
      dataType: "json",
      cache: false,
      success: function(data) {
        this.setState({
          resumeData: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
        alert(err);
      }
    })
  }
  componentDidMount() {
    this.getResumeData();
  }

  render(){
    return (
      <div className="App">
        <Header data={this.state.resumeData.main}/>
        <About data={this.state.resumeData.main}/>
        <Resume data={this.state.resumeData.resume}/>
        <Porto data={this.state.resumeData.portofolio} />
        <Contact data={this.state.resumeData.main}/>
        <Footer data={this.state.resumeData.main} />
        
      </div>
    );
  }
}


export default App;