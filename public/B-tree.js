function  BTreeNode(t,leaf){
        this.t= t;
        this.leaf = leaf;
        this.keys =new Array(2*this.t-1);
        this.C = new Array(2*this.t);
        this.n = 0;
        this.pos= new Point(view.center.x,50);

        this.setPosition = function(pos,depth){
            // if(this.n>this.t){
            //     pos*=1.11;
            // }
            
            this.pos= new Point(view.center.x,50)-new Point(this.n*10,0);
            this.pos+= new Point(pos*4*(this.t)*40,depth*100);
        }


        this.draw = function(){
            //Finding center of screen
            var center = this.pos; 


            var BTnode = new Path.Rectangle(center,[(this.n)*35,30]);
            BTnode.strokeColor= "black";
            for(var i=0;i<this.n&&this.keys[i]!=undefined;i++){
                var textPos =new Point(i*30+10,15)+center;
               
                var text = new PointText(textPos);
                text.content = this.keys[i];
                // console.log("printed ",text.content,"at",new Point(i*20,20)+center);
                text.fillColor = "blue";
                if(!this.leaf){
                    var start = textPos +new Point(-10,0);
                    var end = this.C[i].pos+[this.C[i].n*20,0];
                    console.log("child:",end);
                    var path = new Path(start,end);
                    // var arrow = new Path(end-[-10,10],end,end-[10,10]);
                    path.strokeColor = 'black';
                    // arrow.closed = true;
                    // arrow.strokeColor = 'black';
                    if(i==this.n-1){
                        var path2= new Path(start+[30,0],this.C[i+1].pos+[this.C[i].n*5,0]);
                        path2.strokeColor = 'black';

                    }

                }
            }
        }

    this.traverse= function(){
        var i;
        for(i=0;i<this.n;i++)
        {
            if(this.leaf==false)
            {
                this.C[i].traverse();

            }
        }
        if(this.leaf==false)
        {
            this.C[i].traverse();
        }

    }

    this.search = function(k){
        var i=0;
        while(i<this.n && k>this.keys[i]){
            i++;
        }
        if(this.keys[i]==k){
            return this;        //flagged
        }
        if(this.leaf ==true){
            return null;
        }
        return this.C[i].search(k);
    }

    this.insertNonFull= function(k){
        var i = this.n-1;
        if(this.leaf ==true){
            while(i>=0 && this.keys[i]>k){
                this.keys[i+1] =this.keys[i];
                i--;
            }

            this.keys[i+1]=k;
            this.n++;


        }

        else{
            while(i>=0 && this.keys[i]>k){
                i--;
            }
            if(this.C[i+1].n===2*this.t-1){
                this.splitChild(i+1,this.C[i+1]);
                if(this.keys[i+1]<k){
                    i++;
                }
            }
            this.C[i+1].insertNonFull(k);
        }

    }

    this.splitChild = function(i,y){
        var z = new BTreeNode(y.t,y.leaf);
        z.n = this.t-1;

        for(var j =0;j<this.t-1;j++){
            z.keys[j]= y.keys[j+this.t];
        }
        if(y.leaf == false){
            for(var j=0;j<this.t;j++){
                z.C[j]= y.C[j+this.t];
            }
        }

        y.n= this.t-1;
        
        for(var j=this.n;j>=i+1;j--){
            this.C[j+1] = this.C[j];
        }

        this.C[i+1]=z;

        for(var j=this.n-1;j>=i;j--){
            this.keys[j+1]= this.keys[j];
        }

        this.keys[i] = y.keys[t-1];

        this.n++;
        
        // z.pos= y.pos+new Point(z.n/2*20,50);
        // y.pos= y.pos+new Point(-z.n*20,50);




    }


};

BTreeNode.prototype.findKey= function(k){
    var idx=0;
    while(idx<this.n&&this.keys[idx]<k){
        ++idx;
    }
    return idx;
}
BTreeNode.prototype.remove= function(k) 
{ 
    var idx = this.findKey(k); 
  
    // The key to be removed is present in this node 
    if (idx < this.n && this.keys[idx] == k) 
    { 
  
        // If the node is a leaf node - removeFromLeaf is called 
        // Otherwise, removeFromNonLeaf function is called 
        if (this.leaf){
            this.removeFromLeaf(idx);
        }
             
        else{
            this.removeFromNonLeaf(idx); 
        }
            
    } 
    else
    { 
  
        // If this node is a leaf node, then the key is not present in tree 
        if (this.leaf) 
        { 
            console.log("The key ", k," is does not exist in the tree"); 
            return; 
        } 
  
        // The key to be removed is present in the sub-tree rooted with this node 
        // The flag indicates whether the key is present in the sub-tree rooted 
        // with the last child of this node 
        var flag = ( (idx==this.n)? true : false ); 
  
        // If the child where the key is supposed to exist has less that t keys, 
        // we fill that child 
        if (this.C[idx].n < this.t) {
                this.fill(idx);
            } 
  
        // If the last child has been merged, it must have merged with the previous 
        // child and so we recurse on the (idx-1)th child. Else, we recurse on the 
        // (idx)th child which now has atleast t keys 
        if (flag && idx >this.n) {
            this.C[idx-1].remove(k);
        } 
        else
        {
            this.C[idx].remove(k); 
        }
            
    } 
    return; 
} 
  
// A function to remove the idx-th key from this node - which is a leaf node 
BTreeNode.prototype.removeFromLeaf = function(idx) 
{ 
  
    // Move all the keys after the idx-th pos one place backward 
    for (var i=idx+1; i<this.n; ++i) 
        this.keys[i-1] = this.keys[i]; 
  
    // Reduce the count of keys 
    this.n--; 
  
    return; 
} 
  
// A function to remove the idx-th key from this node - which is a non-leaf node 
BTreeNode.prototype.removeFromNonLeaf = function(idx) 
{ 
  
    var k = this.keys[idx]; 
  
    // If the child that precedes k (C[idx]) has atleast t keys, 
    // find the predecessor 'pred' of k in the subtree rooted at 
    // C[idx]. Replace k by pred. Recursively delete pred 
    // in C[idx] 
    if (this.C[idx].n >= t) 
    { 
        var pred = this.getPred(idx); 
        this.keys[idx] = pred; 
        this.C[idx].remove(pred); 
    } 
  
    // If the child C[idx] has less that t keys, examine C[idx+1]. 
    // If C[idx+1] has atleast t keys, find the successor 'succ' of k in 
    // the subtree rooted at C[idx+1] 
    // Replace k by succ 
    // Recursively delete succ in C[idx+1] 
    else if  (this.C[idx+1].n >= this.t) 
    { 
        var succ = this.getSucc(idx); 
        this.keys[idx] = succ; 
        this.C[idx+1].remove(succ); 
    } 
  
    // If both C[idx] and C[idx+1] has less that t keys,merge k and all of C[idx+1] 
    // into C[idx] 
    // Now C[idx] contains 2t-1 keys 
    // Free C[idx+1] and recursively delete k from C[idx] 
    else
    { 
        this.merge(idx); 
        this.C[idx].remove(k); 
    } 
    return; 
} 

// A function to get predecessor of keys[idx] 
BTreeNode.prototype.getPred= function(idx) 
{ 
    // Keep moving to the right most node until we reach a leaf 
    var cur=this.C[idx]; 
    while (!cur.leaf) 
        cur = cur.C[cur.n]; 
  
    // Return the last key of the leaf 
    return cur.keys[cur.n-1]; 
} 
  
BTreeNode.prototype.getSucc= function(idx) 
{ 
  
    // Keep moving the left most node starting from C[idx+1] until we reach a leaf 
    var cur = this.C[idx+1]; 
    while (!cur.leaf) 
        cur = cur.C[0]; 
  
    // Return the first key of the leaf 
    return cur.keys[0]; 
} 
  
// A function to fill child C[idx] which has less than t-1 keys 
BTreeNode.prototype.fill= function(idx) 
{ 
  
    // If the previous child(C[idx-1]) has more than t-1 keys, borrow a key 
    // from that child 
    if (idx!=0 && this.C[idx-1].n>=t) 
        this.borrowFromPrev(idx); 
  
    // If the next child(C[idx+1]) has more than t-1 keys, borrow a key 
    // from that child 
    else if (idx!=this.n && this.C[idx+1].n>=t) 
        this.borrowFromNext(idx); 
  
    // Merge C[idx] with its sibling 
    // If C[idx] is the last child, merge it with with its previous sibling 
    // Otherwise merge it with its next sibling 
    else
    { 
        if (idx != this.n) 
            this.merge(idx); 
        else
            this.merge(idx-1); 
    } 
    return; 
} 
// A function to borrow a key from C[idx-1] and insert it 
// into C[idx] 
BTreeNode.prototype.borrowFromPrev= function(idx) 
{ 
  
    var child=this.C[idx]; 
    var sibling=this.C[idx-1]; 
  
    // The last key from C[idx-1] goes up to the parent and key[idx-1] 
    // from parent is inserted as the first key in C[idx]. Thus, the  loses 
    // sibling one key and child gains one key 
  
    // Moving all key in C[idx] one step ahead 
    for (var i=child.n-1; i>=0; --i) 
       {
        child.keys[i+1] = child.keys[i]; 
       } 
  
    // If C[idx] is not a leaf, move all its child pointers one step ahead 
    if (!child.leaf) 
    { 
        for(var i=child.n; i>=0; --i){
            child.C[i+1] = child.C[i]; 
           }
    } 
  
    // Setting child's first key equal to keys[idx-1] from the current node 
    child.keys[0] = this.keys[idx-1]; 
  
    // Moving sibling's last child as C[idx]'s first child 
    if(!child.leaf) 
        child.C[0] = sibling.C[sibling.n]; 
  
    // Moving the key from the sibling to the parent 
    // This reduces the number of keys in the sibling 
    this.keys[idx-1] = sibling.keys[sibling.n-1]; 
  
    child.n += 1; 
    sibling.n -= 1; 
  
    return; 
} 
  
// A function to borrow a key from the C[idx+1] and place 
// it in C[idx] 
BTreeNode.prototype.borrowFromNext = function(idx) 
{   
    var child= this.C[idx]; 
    var sibling=this.C[idx+1]; 
  
    // keys[idx] is inserted as the last key in C[idx] 
    child.keys[(child.n)] = this.keys[idx]; 
  
    // Sibling's first child is inserted as the last child 
    // into C[idx] 
    if (!(child.leaf)) 
        child.C[(child.n)+1] = sibling.C[0]; 
  
    //The first key from sibling is inserted into keys[idx] 
    this.keys[idx] = sibling.keys[0]; 
  
    // Moving all keys in sibling one step behind 
    for (var i=1; i<sibling.n; ++i) 
        sibling.keys[i-1] = sibling.keys[i]; 
  
    // Moving the child pointers one step behind 
    if (!sibling.leaf) 
    { 
        for(var i=1; i<=sibling.n; ++i) 
            sibling.C[i-1] = sibling.C[i]; 
    } 
  
    // Increasing and decreasing the key count of C[idx] and C[idx+1] 
    // respectively 
    child.n += 1; 
    sibling.n -= 1; 
  
    return; 
} 

// A function to merge C[idx] with C[idx+1] 
// C[idx+1] is freed after merging 
BTreeNode.prototype.merge= function(idx) 
{ 
    var child = this.C[idx]; 
    var sibling = this.C[idx+1]; 
  
    // Pulling a key from the current node and inserting it into (t-1)th 
    // position of C[idx] 
    child.keys[t-1] = this.keys[idx]; 
  
    // Copying the keys from C[idx+1] to C[idx] at the end 
    for (var i=0; i<sibling.n; ++i) 
        child.keys[i+t] = sibling.keys[i]; 
  
    // Copying the child pointers from C[idx+1] to C[idx] 
    if (!child.leaf) 
    { 
        for(var i=0; i<=sibling.n; ++i) 
            child.C[i+t] = sibling.C[i]; 
    } 
  
    // Moving all keys after idx in the current node one step before - 
    // to fill the gap created by moving keys[idx] to C[idx] 
    for (var i=idx+1; i<this.n; ++i) 
        this.keys[i-1] = this.keys[i]; 
  
    // Moving the child pointers after (idx+1) in the current node one 
    // step before 
    for (var i=idx+2; i<=this.n; ++i) 
        this.C[i-1] = this.C[i]; 
  
    // Updating the key count of child and the current node 
    child.n += sibling.n+1; 
    this.n--; 
  
    // Freeing the memory occupied by sibling 
    // delete(sibling); 
    return; 
} 




//Start of Btree 
function BTree(t){
        this.root = null;
        this.t = t;

    this.search = function(data){
        if(this.root==null){
            return null;
        }
        else{
            return this.root.search(data);
        }


    }
    this.traverse= function(){
        if(this.root!==null){
            this.root.traverse();
        }
    }

    this.insert= function(k){
        if(this.root ==null){
            this.root = new BTreeNode(this.t,true,0);
            this.root.keys[0]= k;
            this.root.n=1;
            // this.root.pos = new Point(view.center.x,50);
        }
        else{
            if(this.root.n==2*this.t-1){
                var s = new BTreeNode(this.t,false,this.root.pos);
                s.C[0]= this.root;
                s.splitChild(0,this.root);

                var i =0;
                if(s.keys[i]<k){
                    i++;
                }
                //Managing the space
                // for(var k=0;k<s.n;k++){
                //     s.C[k].pos=s.pos+new Point(-s.n*20+k*40,50);                                                                         
                // }
                s.C[i].insertNonFull(k);
                this.root = s;
            }
            else{
                this.root.insertNonFull(k);
            }
            
        }

    }

    this.remove = function(k){
        if(!this.root){
            alert("the Tree is empty\n");
            return;
        }
        this.root.remove(k);

        if(this.root.n ===0){
            var tmp = this.root;
            if(this.root.leaf){
                this.root = null;

            }
             else{
                this.root = this.root.C[0];
            }
        return;
        }

    }


    
};
//End of Btree
var degree= prompt("Enter the degree(2,3):");
console.log("prompt",degree);
var d =document.querySelector('input#defaultdegree');
if(degree==2){
    d.click();
    
}
else{
    document.querySelector('input#nondefaultdegree').click();
}

// d.nextSibling.addEventListener('click',function(){
//     console.log("pressed");
// })



var t= new BTree(parseInt(degree)); // A B-Tree with minium degree 3 
// console.log(t);
posArray = [];
function reload(){
    project.activeLayer.removeChildren();
    posArray=[];
    if(t.root!=null){
        managePos(t.root,0.00,0);
        Draw(t.root);
    }
}
var lastpos;
function managePos(tree,pos,d){
    var Depth = d;
    if(tree.n>tree.t&&tree.t==2){
        pos*=1.25;
    }
    tree.setPosition(pos,d);
    if(!tree.leaf){
        for(var i=0;i<=tree.n;i++){
            if(pos-1<0){
                pos*=1.11;
                // console.log(pos);
            }
            else if(pos==0){
                pos=-0.01;
            }
            else{
                pos*=1.11;
                // console.log(pos);

            }
            managePos(tree.C[i],pos+(i-tree.n/2)/Math.pow(1.8,Depth),Depth+1);
        }
    }

}


function Draw(tree){
    tree.draw();
    if(!tree.leaf){
        for(var i=0;i<=tree.n;i++){
            // posArray.push([pos,Depth]);            
            Draw(tree.C[i]);
                // console.log(pos+(i-tree.n.toFixed(4)/2)/Math.pow(2,Depth+1));         

        }
    }

    else{
        // console.log("Found Rock Bottom");
        }
}
console.log(document.querySelector('input#defaultdegree').click());
var inp = document.querySelector('input#textInsert');
var rem = document.querySelector('input#textRemove');
var search = document.querySelector('input#textSearch');
inp.addEventListener("keypress",function(event){

    if(event.keyCode == 13){
        t.insert(parseInt(inp.value));
        inp.value = parseInt(inp.value)+1;
        reload();

    }

});

rem.addEventListener("keypress",function(event){

    if(event.keyCode == 13){
        t.remove(parseInt(rem.value));
        rem.value = "";
        reload();

    }

});
search.addEventListener("keypress",function(event){

    if(event.keyCode == 13){
        if(t.search(parseInt(search.value))){
            var alert = document.createElement('div');
            alert.className="alert alert-success";
            alert.innerHTML = "<strong>Element FOUND</strong>"
            var jumb = document.querySelector("#instruction");
            jumb.appendChild(alert);
            setInterval(function(){
                jumb.removeChild(alert);
                
                clearInterval();

            },2000)
        }
        else{
            var alert = document.createElement('div');
            alert.className="alert alert-warning";
            alert.innerHTML = "<strong>No such element FOUND</strong>"
            var jumb = document.querySelector("#instruction");
            jumb.appendChild(alert);
            setInterval(function(){
                jumb.removeChild(alert);
                clearInterval();

            },5000)
        }
        search.value = '';
        // reload();

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