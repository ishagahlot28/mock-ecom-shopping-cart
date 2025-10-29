import React, { useEffect, useState } from 'react'
import axios from 'axios'

function App(){
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [receipt, setReceipt] = useState(null)

  const loadProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products')
    setProducts(res.data)
  }
  const loadCart = async () => {
    const res = await axios.get('http://localhost:5000/api/cart')
    setCart(res.data.items); setTotal(res.data.total)
  }

  useEffect(()=>{ loadProducts(); loadCart(); },[])

  const addToCart = async (productId) => {
    await axios.post('http://localhost:5000/api/cart', { productId, qty: 1 })
    await loadCart()
  }
  const removeFromCart = async (id) => {
    await axios.delete('http://localhost:5000/api/cart/'+id)
    await loadCart()
  }
  const updateQty = async (id, qty) => {
    await axios.put('http://localhost:5000/api/cart/'+id, { qty })
    await loadCart()
  }
  const doCheckout = async () => {
    const res = await axios.post('http://localhost:5000/api/checkout', { name, email })
    setReceipt(res.data.receipt)
    await loadCart()
  }

  return (<div style={{fontFamily:'Arial', padding:20}}>
    <h1>Mock E‑Com Cart (SQLite)</h1>
    <div style={{display:'flex', gap:20}}>
      <div style={{flex:1}}>
        <h2>Products</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
          {products.map(p=>(
            <div key={p.id} style={{border:'1px solid #eee', padding:12, borderRadius:8}}>
              <div style={{height:120, background:'#fafafa', display:'flex', alignItems:'center', justifyContent:'center'}}>{p.image || 'IMG'}</div>
              <h3>{p.name}</h3>
              <div>₹{p.price}</div>
              <button onClick={()=>addToCart(p.id)} style={{marginTop:8}}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
      <div style={{width:360}}>
        <h2>Cart</h2>
        {cart.length===0 && <div>No items</div>}
        {cart.map(c=>(
          <div key={c.id} style={{borderBottom:'1px solid #eee', padding:8}}>
            <div>{c.name}</div>
            <div>₹{c.price} x <input type="number" value={c.qty} onChange={(e)=>updateQty(c.id, Number(e.target.value))} style={{width:60}}/></div>
            <button onClick={()=>removeFromCart(c.id)} style={{marginTop:6}}>Remove</button>
          </div>
        ))}
        <h3>Total: ₹{total}</h3>
        <h3>Checkout</h3>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%', marginBottom:6}}/>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', marginBottom:6}}/>
        <button onClick={doCheckout}>Place Order</button>
        {receipt && <div style={{marginTop:12, padding:8, border:'1px solid #0f0'}}>
          <div>Receipt ID: {receipt.id}</div>
          <div>Total Paid: ₹{receipt.total}</div>
          <div>Time: {receipt.timestamp}</div>
        </div>}
      </div>
    </div>
  </div>)
}

export default App
