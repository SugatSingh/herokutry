

function Node(data,pos){
    
        this.data= data;
        this.next = null;
        this.pos =pos;

        
        this.draw = function(){
            var node = new Path.Rectangle(this.pos,[50,30],5);
            var text = new PointText(new Point(25,20)+this.pos);
            var head = new PointText(new Point(view.center.x-50,60));
            head.content = "Head";
            text.justification = 'center';
            text.fillColor = 'red';
            text.content = data;
            text.onMouseEnter = function(event){
                node.fillColor = Color(200,20,100);
                text.fillColor = "white";
                // node.translate(new Point(100,0));
            }
            text.onMouseLeave = function(event){
                node.fillColor = null;
                text.fillColor = 'red';
            }

            
            node.strokeColor = 'black';
            if(this.next){
                var start = new Point(this.pos.x+25,this.pos.y+30);
                var end = new Point(25,0)+this.next.pos;
                var path = new Path(start,end);
                var arrow = new Path(end-[-10,10],end,end-[10,10]);
                path.strokeColor = 'black';
                arrow.closed = true;
                arrow.strokeColor = 'black';
            }

            

        }
        this.translate = function(delta){
            this.pos+=delta;
            console.log("translation "+this.pos+ this.data)

        }

};


function List() {
        this.head = null;
        this.pos = new Point(view.center.x,50);

    
    this.push = function(data)
    {
        if(!this.head){
            this.head = new Node(data,this.pos);

        }
        else{
            var newnode = new Node(data,this.head.pos);
            newnode.next = this.head;
            this.head= newnode;
            for(var i=newnode.next;i!=null;i=i.next){
                i.translate(new Point(0,50));
            }

        }
    }

    this.insertAtEnd= function (data){
        var newnode = new Node(data,this.pos);
        console.log("posit",this.pos);
        if(!this.head)
        {
            this.head = newnode;
        }
        else{
            newnode.translate(new Point(0,50));
            var temp = this.head;
            while(temp.next!==null)
            {
                temp = temp.next;
                newnode.translate(new Point(0,50));
            }
            temp.next = newnode;
        };
    }

    this.insertAt= function(data,position){
        var newnode = new Node(data,this.pos);
        if(!this.head)
        {
            this.head = newnode;
        }
        else{
        var prev = this.head;
        var temp = prev.next;
        newnode.translate(new Point(0,50));
        for(var i=0;(i<position)&&(temp!=null);i++)
        {
            
            prev= temp;
            temp = temp.next;
            newnode.translate(new Point(0,50));
            console.log(prev.data);

        }
        
        newnode.next = prev.next;
        prev.next = newnode;
        for(temp = newnode.next;temp!=null;temp = temp.next){
            console.log(temp.data);
            temp.translate(new Point(0,50));
        }
    }
}

    this.searchData = function(data){
        var prev = null;
        var flag  =0;
        for(var temp = this.head;temp!=null;temp= temp.next,prev=temp){
            temp.selected = true;

            if(temp.data==data){
                console.log("Data Found");
                return [prev,temp];
            }
            
            temp.selected = false;
        }
        console.log("Data not found");
        return null;
    }

    this.pop= function(){
        if(this.head === null)
        {
            alert("Invalid Act: Underflow Occured");
            return;
        }
        if(this.head.next === null){
            var pop = this.head.data;
            this.head = null;
            // alert(pop," is popped");
            
            return pop;
        }
        else{
            var prev = this.head;
            var tempnode = this.head.next;
            while(tempnode.next!=null)
            {
                prev = tempnode;
                tempnode=tempnode.next;
            }
            pop = tempnode.data;
            prev.next = null;
            // alert(pop," is popped");
            return pop;

        }
    }

    this.dequeue= function(){
        if(!this.head){
            alert("Invalid : Underflow occured");
            return;
        }
        var data = this.head.data;
        this.head = this.head.next;
        for(var temp= this.head;temp!=null;temp= temp.next){
            temp.translate(new Point(0,-50));
        }
        // alert(data ," is dequeued");

        return data;
    }

    this.deleteData= function(data){
        var prev = this.searchData(data);
        if(prev){
            if(this.head.data===data){
                this.dequeue();
            }
            else{
                for(var temp=this.head;temp.next.data!=data;temp=temp.next);
            temp.next = temp.next.next;
            while(temp.next!=null){
                    temp.next.translate(new Point(0,-50));
                    temp = temp.next;
                }
                return;
        }

            }   
    
    }

};


function reload(){
    project.activeLayer.removeChildren();
        for(var i = list.head;i!==null;i=i.next){
            i.draw();
            console.log(i.pos);
        }
};


    var list = new List();
    // list.push(12);
    // list.insertAtEnd(30);
    // list.insertAtEnd(40);
    // list.insertAtEnd("sd");

    // list.insertAt('At',2);
    // list.insertAtEnd('last');
    // list.push('first');
    // // for(var i = list.head;i!==null;i=i.next){
    // //     i.draw();
    // //     list.pos+=[0,80];
    // //     console.log(i.pos);
    // //  }

    // list.pop();
    // list.dequeue();
    // list.searchData(40);
    // console.log("center: " + view.center);

    // var at = new Point(100,100);
    var inp = document.querySelectorAll("input");
    
    inp[0].addEventListener("keypress",function(event){
        if(event.keyCode === 13){
            if(inp[0].value===''){
                alert("No data");
            }
            else{
            list.push(inp[0].value);
            inp[0].value ="";
            reload();
            }
        }
        
    });

    inp[1].addEventListener("keypress",function(event){
        if(event.keyCode === 13){
            if(inp[1].value===''){
                alert("No data");
            }
            else{
            list.insertAtEnd(inp[1].value);
            inp[1].value ="";
            reload();
            }
        }
        
    });

    inp[2].addEventListener("keypress",function(event){
        if(event.keyCode === 13){
            if(inp[2].value===''){
                inp[2].focus();
            }
            else 
            {
                inp[3].focus();
            }
        }
        
    });

    inp[3].addEventListener("keypress",function(event){
        if(event.keyCode === 13){
            if(inp[2].value===''||inp[3].value===''){
                inp[2].focus();
            }
            else{
            list.insertAt(inp[2].value,inp[3].value);
            inp[2].value ="";
            reload();
            }
        }
        
    });

    inp[4].addEventListener('click',function(){
        list.pop();
        reload();
        
    });

    inp[5].addEventListener('click',function(){
        list.dequeue();
        reload();
    });
    
    
 
    
    inp[6].addEventListener("keypress",function(event){
        if(event.keyCode === 13){
            if(inp[6].value===''){
                alert("No data");
            }
            else{
            list.deleteData(inp[6].value);
            inp[6].value ="";
            reload();
            }
        }
        
    });

    
var toolPan = new Tool()
toolPan.activate()

// On drag, scroll the View by the difference between mousedown 
// and mouseup
toolPan.onMouseDrag = function (event) {
    var delta = event.downPoint.subtract(event.point)
    view.scrollBy(delta)
};