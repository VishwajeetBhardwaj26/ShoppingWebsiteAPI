class ApiFeatures {
    constructor(query,querystr) {
        this.query=query;
        this.querystr=querystr;
    }
    //search feature
    search(){
        const keyword = this.querystr.keyword 
        ?{
             name:{
                 $regex:this.querystr.keyword,
                 $option:"i",
             },
        }
        :{}
        this.query=this.query.find({...keyword});
        return this;
    }
    //filter feature
    filter(){
        const queryCopy ={...this.querystr};
        const removeFields=["keyword","page","limits"];
        removeFields.forEach((key)=>delete queryCopy[key]);
        //filter for price and rating
        let querystr=JSON.stringify(queryCopy);
        querystr = querystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        this.query =this.query.find(JSON.parse(querystr));
        return this;
    }
    //pagination feature
    pagination(resultPerPage){
        const currentPage =Number(this.querystr.page)||1;
        const skip = resultPerPage * (currentPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}
module.exports = ApiFeatures