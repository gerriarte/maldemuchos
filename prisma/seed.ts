async function main() {
  console.log("No seed data configured.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
