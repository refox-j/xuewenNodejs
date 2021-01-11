const express=require("express");

const pool = require("../pool.js");

const md5 = require("md5");

const r = express.Router();

r.post('/login',(req,res)=>{
	let username = req.body.username;
	let password = md5(req.body.password);
	let str = "select id,username,nickname,avatar,article_number from xzqa_author where username=? and password=?"
	pool.query(str,[username,password],(err,results)=>{
		if(err) throw err;
		if(results.length){
			res.send({code:200,message:"登录成功",results:results[0]});
		}else{
				res.send({code:201,message:"登录失败"});
		}
	})
})

r.post("/register",(req,res)=>{
		// console.log(md5(req.body.upwd));
    var uname = req.body.uname;
    var wpwd = req.body.upwd;
		var str = "select count(id) as count from xzqa_author where username=?";
		pool.query(str,[uname],(err,result)=>{
			if(err) throw err;
			// console.log(result[0].count)
			if(result[0].count){
				res.send({code:201,message:"用户注册失败"});
			}else{
				str="insert into xzqa_author(username,password) values(?,MD5(?))";
				pool.query(str,[uname,wpwd],(err,results)=>{
					res.send({code:200,message:"用户注册成功"});
				})
				
			}
		})
    
});

r.get("/articles",(req,res)=>{
		
    var cid = req.query.c_id;
		var page= req.query.page;
		var count=20;
		var rowcount=0;
		var str="select count(id) as count from xzqa_article where category_id=?";
		pool.query(str,[cid],(err,result)=>{
			if(err) throw err;
			rowcount=result[0].count;
			var pagecount=Math.ceil(rowcount/count);
		
		
			str="select id,subject,description,image from xzqa_article where category_id=? LIMIT ?,?";
			pool.query(str,[cid,(page-1)*count,count],(err,results)=>{
				if(err) throw err;
				res.send({
					code:200,
					message:"查询成功",
					results:results,
					pagecount:pagecount
				});
			})
		})
});

r.get('/category',(req,res)=>{
		var str="select id,category_name from xzqa_category ORDER BY id";
		pool.query(str,(err,results)=>{
			if(err)throw err;
			// console.log(result);
			res.send({
				code:200,
				message:"查询成功",
				results:results
			});
		})
});


r.get('/review',(req,res)=>{
		var id = req.query.id;
		var str = 'select r.id,subject,content,created_at,nickname,avatar,article_number from xzqa_article as r inner join xzqa_author as u on author_id = u.id where r.id=?';
		pool.query(str,[id],(err,results)=>{
			if(err) throw err;
			res.send({
				code:200,
				message:"成功",
				results:results[0]
			})
		});
})
// 

r.get('/comments',(req,res)=>{
	let id = req.query.id;
	let page = req.query.page;
	let rowcount=5;
	let offset=(page-1)*rowcount;
	let pagecount=0;
	let str="select c.id,content,username,avatar from xzqa_comments as c inner join xzqa_users as u on user_id = u.id where article_id = ? order by c.id limit ?,?";
	pool.query(str,[id,offset,rowcount],(err,results)=>{
		if(err) throw err;
		// console.log(results)
		str = "select count(id) as count from xzqa_comments where article_id=?"
		pool.query(str,[id],(err,result)=>{
			if(err) throw err;
			// console.log(result[0].count);
			// console.log(Math.ceil(result[0].count / rowcount));
			pagecount = Math.ceil(result[0].count / rowcount);
			// console.log(pagecount)
			res.send({
				code:200,
				message:"成功",
				results:results,
				pagecount:pagecount
			})
		})
		// console.log(pagecount);
	
	})
})

r.get('/users',(req,res)=>{
	res.send({name:'web2008',sex:false})
})

module.exports=r;