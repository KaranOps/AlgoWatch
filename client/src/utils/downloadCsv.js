export function convertToCSV(data) {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // header row first
    ...data.map(row =>
      headers.map(field => `"${row[field] ?? ''}"`).join(',')
    ),
  ];
  return csvRows.join('\n');
}