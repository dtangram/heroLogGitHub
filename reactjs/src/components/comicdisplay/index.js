import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import '../../css/main.css';
import item1 from '../../img/item1.jpg';
import item2 from '../../img/item2.jpg';
import item3 from '../../img/item3.jpg';

class ComicDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Container fluid className="container">
        <Row className="row">
          <Col sm="12" md="4">
            <figure className="figure">
              <img src={item1} alt="" />
            </figure>
          </Col>

          <Col sm="12" md="4">
            <figure className="figure">
              <img src={item2} alt="" />
            </figure>
          </Col>

          <Col sm="12" md="4">
            <figure className="figure">
              <img src={item3} alt="" />
            </figure>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default (ComicDisplay);
