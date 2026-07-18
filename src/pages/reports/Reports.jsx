import { useEffect, useMemo, useState } from "react";

import Layout from "../../components/layout/Layout";
import ReportsSummary from "../../components/reports/ReportsSummary";
import ReportsToolbar from "../../components/reports/ReportsToolbar";
import ReportsTable from "../../components/reports/ReportsTable";
import { exportReportToExcel } from "../../services/reportExportService";

import { getReportData } from "../../services/reportService";

function Reports() {
  const [records, setRecords] = useState([]);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const data = await getReportData();
  
      console.log(data); // 👈 idagdag ito
  
      setRecords(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const employee =
        record.employees?.full_name?.toLowerCase() || "";

      const matchesSearch =
        employee.includes(search.toLowerCase());

        const attendanceDate = record.attendance_date;

      const matchesStart =
        !startDate || attendanceDate >= startDate;

      const matchesEnd =
        !endDate || attendanceDate <= endDate;

      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [records, search, startDate, endDate]);

  function handleExportExcel() {
    exportReportToExcel(filteredRecords);
  }

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Reports
          </h1>

          <p className="mt-1 text-slate-500">
            Generate attendance reports and analytics.
          </p>
        </div>

        <ReportsToolbar
          search={search}
          setSearch={setSearch}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          onExportExcel={handleExportExcel}
        />

        <ReportsSummary
          records={filteredRecords}
        />

      <ReportsTable
  records={filteredRecords}
/>


      </div>
    </Layout>
  );
}

export default Reports;