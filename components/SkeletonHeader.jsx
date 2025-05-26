export default function SkeletonHeader() {
  return (
    <div
      style={{
        height: "60px",
        backgroundColor: "#f3f3f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ width: "120px", height: "20px", background: "#ddd", borderRadius: "4px" }} />
      <div style={{ width: "80px", height: "20px", background: "#ddd", borderRadius: "4px" }} />
    </div>
  );
}
