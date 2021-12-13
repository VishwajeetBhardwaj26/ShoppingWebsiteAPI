module.exports = syncErrors => (req,res,next)=> {
    Promise.resolve(syncErrors(req,res,next)).catch(next);
};