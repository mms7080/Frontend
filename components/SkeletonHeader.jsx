export default function SkeletonHeader({bg='#f3f3f3'}) {
  return (
    <div
      style={{
        height: "100px",
        backgroundColor:bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom:"1px solid rgba(0, 0, 0, 0.1)",
        boxShadow:"0 2px 4px rgba(0, 0, 0, 0.05)"
      }}
    >
    </div>
  );
}
