export default function ColorBtn({color}:{color:string}){
    return(
        <>
        <div style={{backgroundColor:color,width:'25px',height:'25px',borderRadius:'1000px'}}></div>
        </>
    )
}