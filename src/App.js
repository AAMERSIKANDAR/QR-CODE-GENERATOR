import React from "react";
import { parse } from "papaparse";
import 'bootstrap/dist/css/bootstrap.css';

const callApi=(firstname,lastname, email,notes, index)=> {
  let inputurl = document.querySelector('#inputurl').value;
  console.log('the url is ',`${inputurl}?firstname=${firstname}
  &lastname=${lastname}&email=${email}&notes=${notes}`)
  setTimeout(() => {
    var form_data = new FormData();
  var objectURL
  let newUrl= `${inputurl}?firstname=${firstname}&lastname=${lastname}&email=${email}&notes=${notes}`
  form_data.append("url",newUrl);
  form_data.append("config", document.querySelector('#jsonconfig').value)
  console.log(form_data)
  const request = {
    method: 'POST',
    body: form_data,
    headers: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkIjoxNTEyMTUwODk2NDc4LCJlbWFpbCI6InRlc3Rjb0BtYWlsaW5hdG9yLmNvbSIsIm9yZ05hbWUiOiJ0ZXN0Y28iLCJwYXNzd29yZCI6Ik5hTmFJTGJGb1VPV3V2TUsxd3AxS2xWeDVxMjFLeUhMS01LcmtPVmVNOTYzMTlMdXRIaEcrS3psbTlhSnFnPSIsInByb2ZpbGVJbWFnZSI6ImZhY2Vib29rX3Bob3RvLnBuZyIsInJvbGUiOiJtYXN0ZXIiLCJzY3JlZW5OYW1lIjoidGVzdGNvIiwic3RhdHVzIjoibGl2ZSIsInVzZXJFbWFpbCI6InRlc3Rjb0BtYWlsaW5hdG9yLmNvbSIsInVzZXJJZCI6IjMwNjA1ODNhLWJiMjctNDU4YS1iZTE3LTkxYThhYmNhNzRlYSIsImlhdCI6MTUxMjEzMjg5N30.-tc-ZjbTw20mKaXJaSl6tOw8w5hkm584Q-TsFInCUbo'
    }
  }
  var myImage = document.querySelector('#img' + index);
  console.log(request)
  fetch('https://api.alive5.com/1.0/qr/create', request).then(function (response) {
    return response.blob();
  }).then(function (myBlob) {
    console.log('myblob', myBlob)
    objectURL = URL.createObjectURL(myBlob);
    console.log('myblob objectURL', objectURL)
    myImage.src = objectURL
  });
  }, 100);
}

export default function App() {
  const [highlighted, setHighlighted] = React.useState(false);
  const [contacts, setContacts] = React.useState([
  ]);
  const onChangeHandler=event=>{

    console.log(event.target.files[0])
    Array.from(event.target.files)
            .filter((file) => file.type === "text/csv")
            .forEach(async (file) => {
              const text = await file.text();
              const result = parse(text, { header: true });
              setContacts((existing) => [...existing, ...result.data]);
            });

}
  console.log("the contacts are", contacts)
  return (
    <div>
      <h1 className="text-center text-4xl">Drag a file here:</h1>
      <div
        className={`p-6 my-2 mx-auto max-w-md border-2 ${
          highlighted ? "border-green-600 bg-green-100" : "border-gray-600"
          }`}
        onDragEnter={() => {
          setHighlighted(true);
        }}
        onDragLeave={() => {
          setHighlighted(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setHighlighted(false);

          Array.from(e.dataTransfer.files)
            .filter((file) => file.type === "text/csv")
            .forEach(async (file) => {
              const text = await file.text();
              const result = parse(text, { header: true });
              setContacts((existing) => [...existing, ...result.data]);
            });
        }}
      >
        DROP HERE
      </div>
      <div>
      <input type="file" name="file" onChange={onChangeHandler}/>
      </div>
      <div>
      <label>
        URL:
        <input type="text" id="inputurl" placeholder="https://alive5.com" />
      </label>
      </div>
      <div>
        <textarea id="jsonconfig" value='{"body":"pointed-in","eye":"frame5","eyeBall":"ball0","erf1":["fh"],"erf2":[],"erf3":["fh","fv"],"brf1":[],"brf2":[],"brf3":[],"bodyColor":"#b33737","bgColor":"#aca9a9","eye1Color":"#000000","eye2Color":"#000000","eye3Color":"#000000","eyeBall1Color":"#000000","eyeBall2Color":"#000000","eyeBall3Color":"#000000","gradientColor1":"#b33737","gradientColor2":"#0277bd","gradientType":"linear","gradientOnEyes":true,"logo":"https://alive5cdn.s3.amazonaws.com/images/widgets/upload/1598944645035_qr.png","logoMode":"default"}'></textarea>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col">Notes</th>
            <th scope="col">QR-CODE</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => {
            if(contact.firstname) {callApi(contact.firstname, 
              contact.lastname, 
              contact.email,
              contact.note,
              index)}
            return <> 
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{contact.firstname}</td>
                <td>{contact.lastname}</td>
                <td>{contact.email}</td>
                <td>{contact.note}</td>
                <td> <img id={'img' + index}  style={{width:300}} /></td>
              </tr>
            </>
          })}
        </tbody>
      </table>
      {/* <img id="img" /> */}
    </div>
  );
}


