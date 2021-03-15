import React, {Component} from 'react';
import axios from 'axios';
import './App.css';
// install node v11: https://gist.github.com/d2s/372b5943bce17b964a79

class App extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      // Uploda vars
      success: false,
      url: "",
      tmpLabel: "",
      customLabels: [],
      // Search vars
      searchInput: ""
    }
    // Upload funcs declarations
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.labelChange = this.labelChange.bind(this);
    this.addLabelClick = this.addLabelClick.bind(this);
    this.clearLabels = this.clearLabels.bind(this);
    // Search funcs declarations
    this.searchInputChange = this.searchInputChange.bind(this);
    this.searchClickSubmit = this.searchClickSubmit.bind(this);
  }
  
  // upload function definitions
  handleChange = (e) => {
    this.setState({
      success: false,
      url: ""
    });
  }

  handleUpload = (e) => {
    let file = this.uploadInput.files[0];
    console.log("file: ", file)
    // Split the filename to get the name and type, ex: test.jpg
    let fileParts = this.uploadInput.files[0].name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    let { customLabels } = this.state;
    console.log("fileName: ", fileName);
    console.log("fileType: ", fileType);
    console.log("customLabels: ", customLabels);
    // Prepare for the uplaod

    axios.post("http://localhost:3001/sign_s3",{
      fileName : fileName,
      fileType : fileType,
      Metadata: JSON.stringify(customLabels)
    })
    .then(response => {
      var returnData = response.data.data.returnData;
      var signedRequest = returnData.signedRequest;
      var url = returnData.url;
      console.log("returnData url: ", url);
      this.setState({
        url: url
      })
      console.log("received a signed request: " + signedRequest);
      // ex: https://photo-cc-p2-bucket.s3.amazonaws.com/exam?AWSAccessKeyId=AKIAQ6O4UIK5NQU5LCER&Content-Type=jpg&Expires=1615789091&Signature=XGCWXM96vEtU%2FsBO6zeh%2B4NELfs%3D&x-amz-acl=public-read

      // Add fileTypevar options = {} and CORS HEADER in the HEADERS
      var options = {
        headers: {
          'Access-Control-Allow-Origin': "*",
          'Content-Type': fileType
          // 'x-amz-meta-customLabels': customLabels[0]
        }
      };
      axios.put(signedRequest, file, options)
      .then(result => {
        console.log("Response from S3: ", result);
        this.setState({
          success: true
        })
        // .catch(err => {
        //   console.log("ERROR: ", err);
        // })
      })//.then(result)
    }).catch(err => {
      console.log("ERROR: ", err);
    })
  }

  labelChange = (e) => {
    this.setState({ tmpLabel: e.target.value });
  }

  addLabelClick = () => {
    this.setState(prevState => ({
      customLabels: [...prevState.customLabels, this.state.tmpLabel]
    }));
    this.setState({ tmpLabel: "" });
  }

  clearLabels = () => {
    console.log("clear labels: ", this.state.customLabels);
    this.setState({ customLabels: [] });
  }

  // Search function definitations
  searchInputChange = (e) => {
    this.setState({ searchInput: e.target.value });
  }

  searchClickSubmit = () => {
    const { searchInput } = this.state;
    console.log("searchInput: ", searchInput);
    // GET request to API gateway
    // 'https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search';

    axios.get('https://2okr71h4ab.execute-api.us-east-1.amazonaws.com/v1/search', {
      params: {
        query: searchInput
      },
      options: {
        headers: { 
          "Access-Control-Allow-Origin": "*"
        }
      }
    })
    .then((response) => {
      console.log("get response: ", response);
      const data = response.data.body;
      console.log("bodydata: ", data);
    })
    .catch((error) => {
      console.log(error);
    })

    // reset temp user search input
    this.setState({ searchInput: '' });
  }

  render() {
    const customLabels = this.state.customLabels.map((label, index) =>
      <span key={index} >{label}</span>  
    );

    return(
      <div className="App">
        <h1>Upload the Photo</h1>
        <input type="file" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} />
        <br />

        <input type="text" value={this.state.tmpLabel} onChange={this.labelChange} placeholder="Enter labels"></input>
        <button onClick={this.handleUpload}>UPLOAD</button>
        <br />

        <button onClick={this.addLabelClick}>Add Labels</button>
        <button onClick={this.clearLabels}>Clear Labels</button>
        <br />
        
        {customLabels}

        <br />
        
        {this.state.success ? 
          "Success!" : ""
        }
        <br />

        <h1>Search for Photo</h1>
        <input type="text" value={this.state.searchInput} onChange={this.searchInputChange} placeholder="Search for photos"></input>
        <button onClick={this.searchClickSubmit}>Search</button>
      
        <h1>Photos </h1>
        <img src='https://photo-cc-p2-bucket.s3.amazonaws.com/test3' alt="0" />
        <img src='https://photo-cc-p2-bucket.s3.amazonaws.com/test9' alt="0" />
      </div>
    )
  }
}

export default App;



// https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689