import React, { Component } from "react";
import Zmage from "react-zmage";
import { Fade } from 'react-awesome-reveal';

let id = 0;
class Porto extends Component {
    render() {
        if(!this.props.data) return null;
        
        const projects = this.props.data.projects.map(function(projects) {
            let projectImage = "images/portofolio/" + projects.image;

            return (
                <div key={id++} className="columns portofolio-item">
                    <div className="item-wrap">
                        <Zmage alt={projects.title} src={projectImage} />
                        <div style={{textAlign: "center"}}>{projects.title}</div>
                    </div>
                </div>
            );
        });

        return (
            <section id="portofolio">
                <Fade left duration={1000} distance="40px">
                    <div className="row">
                        <div className="twelve columns collapsed">
                            <h1>These are some of my achievements so far</h1>
                            <div id="portofolio-wrapper" className="bgrid-quarters s-bgrid-thirds cf">
                                {projects}
                            </div>
                        </div>
                    </div>
                </Fade>
            </section>
        );
    }


}

export default Porto;