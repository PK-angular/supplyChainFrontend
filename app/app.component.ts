import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
//import {FormGroup, FormBuilder} from '@angular/forms';
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { HttpClient } from '@angular/common/http';

import {Node,ObjectMapping} from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'robustness';
  name = new FormControl('');
  robustnessForm!: FormGroup;
  robustnessForm1!:FormGroup;
  totalNodes : number = 0;
  toggle:boolean=false;
  totalConnectingNodes : number =0;
 // objarray: Node[] = [];
  form!: FormGroup;
  connectingNodeNames: Array<string>=[];
  objarray= new Array<Node>();
  returnedObject : ObjectMapping;
  robustnessHDA:number;
  robustnessRandom:number;
  robustnessEC:number;
  robustnessValues:Array<any>;
  n:string;


  constructor(private fb: FormBuilder, private http:HttpClient){}

  ngOnInit(){

    this.initForm1();
    this.initForm2();
  }

  initForm1():void{

    this.robustnessForm = this.fb.group({

      numberOfNodes : '',
      ConnectedNodes : 'Enter Total number of connected Nodes'
    });
  }

  initForm2():void{

    this.robustnessForm1 = this.fb.group({
      numberOfConnectingNodes: '',
      nameOfConnectedNodes: ''
      
    })
  }


  onSubmit() : void {

    console.log("Form submitted" + this.robustnessForm.value.numberOfNodes);
    this.totalNodes = this.robustnessForm.value.numberOfNodes;

    for(var i=1;i<=this.totalNodes;i++){

      var tempObj=new Node;
      tempObj.name='n'+i;
      this.objarray.push(tempObj);

    }

  }

  setNumberOfConnectingNode(args:number,i:number) : void {

    console.log("in function"+args,i);

    this.objarray[i].degree=args;
    this.totalConnectingNodes = this.objarray[i].degree!;
    for(let k=0;k<this.objarray.length;k++){

      console.log("Printing objects obj name objdegree"+this.objarray[k].name+' '+this.objarray[k].degree);
    }

  }

  setNameOfConnectingNode(args:any, i:number) {

    console.log("args"+args.target.value+"index"+i);
    let arr = args.target.value.split(',');
    for(let j =0;j<arr.length;j++){

      console.log("splitted string = "+arr[j]);
      this.objarray[i].connectedNodes.push(arr[j]);

    }
    console.log(this.objarray);
  }

  setReturnedObject(obj:ObjectMapping){

    console.log("Calling function"+obj);
    console.log("Calling function123"+String(obj));
     //this.n = String(obj);
    //this.robustnessValues = this.n.split(',');
    this.returnedObject = JSON.parse(JSON.stringify(obj));
    console.log("log2"+this.returnedObject);
    //this.robustnessHDA = this.robustnessValues[0];
    //console.log("log3",this.robustnessHDA);
    //this.robustnessRandom = this.robustnessValues[1];
    //this.robustnessEC = this.robustnessValues[2];
    //console.log("returned values"+this.robustnessHDA+" "+this.robustnessRandom
    //+" "+this.robustnessEC);

  }


  countIndex(i: any) {

    let arr = new Array<number>();

    for(var k=0;k<i;k++){
      arr.push(k);
    }
    return arr;
  }

  CalculateRobustness(){

    console.log("Form submitted" + this.robustnessForm1.value.numberOfConnectingNodes);

    console.log("Final Object list"+JSON.stringify(this.objarray));

    const headers = { 'content-type': 'application/json'}

    console.log("before sending a call");
    //api call
    this.http.post<Array<number>>("http://localhost:8082/api/put", JSON.stringify(this.objarray), 
    {'headers':headers}).subscribe(
      response =>{
        console.log("I am here"+response);
        console.log("aja hun",response)

        this.returnedObject = JSON.parse(JSON.stringify(response));

        console.log("final console = ",this.returnedObject.hdr);
        this.robustnessHDA = this.returnedObject.hdr;
        this.robustnessRandom = this.returnedObject.random;
        this.robustnessEC = this.returnedObject.exhaustive;
        this.toggle = true;
       // console.log("1"+response[0]);
       //this.setReturnedObject(response);
      }
      
  )

  }

  


}
