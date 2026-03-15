import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DocumentArrowDownIcon, PrinterIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import courseService from '../services/courseService';
import enrollmentService from '../services/enrollmentService';

const Certificate = () => {
  const { enrollmentId } = useParams();
  const certificateRef = useRef();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificateData();
  }, [enrollmentId]);

  const fetchCertificateData = async () => {
    try {
      // Fetch enrollment and course details
      // This would come from your backend
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      setData({
        studentName: user.name || 'John Doe',
        courseName: 'Advanced React Development',
        completionDate: new Date().toLocaleDateString(),
        instructorName: 'Dr. Sarah Johnson',
        grade: 'A',
        certificateId: 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
    } catch (err) {
      setError('Failed to load certificate data');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = certificateRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`certificate-${data.certificateId}.pdf`);
  };

  const printCertificate = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate of Completion</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          </style>
        </head>
        <body>
          ${certificateRef.current.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Certificate not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="flex justify-end space-x-4 mb-6">
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={printCertificate}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <PrinterIcon className="h-5 w-5" />
            <span>Print</span>
          </button>
        </div>

        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-white rounded-lg shadow-xl overflow-hidden border-8 border-primary-600"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px'
          }}
        >
          <div className="bg-white rounded-lg p-12 text-center">
            {/* Header */}
            <div className="mb-8">
              <img src="/logo.png" alt="LMS Logo" className="h-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
              <p className="text-gray-600">This certificate is proudly presented to</p>
            </div>

            {/* Student Name */}
            <div className="mb-8">
              <div className="text-5xl font-bold text-primary-600 mb-4 border-b-4 border-primary-600 inline-block pb-2">
                {data.studentName}
              </div>
            </div>

            {/* Course Info */}
            <div className="mb-8">
              <p className="text-xl text-gray-700 mb-2">for successfully completing the course</p>
              <p className="text-3xl font-semibold text-gray-800 mb-4">{data.courseName}</p>
              <p className="text-gray-600">with a grade of</p>
              <p className="text-2xl font-bold text-green-600 mb-4">{data.grade}</p>
            </div>

            {/* Details */}
            <div className="flex justify-center space-x-12 mb-8">
              <div>
                <p className="text-sm text-gray-500">Completion Date</p>
                <p className="font-semibold">{data.completionDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Instructor</p>
                <p className="font-semibold">{data.instructorName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Certificate ID</p>
                <p className="font-semibold">{data.certificateId}</p>
              </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-center space-x-16 mt-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">Instructor Signature</p>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-gray-400 mb-2"></div>
                <p className="text-sm text-gray-600">Director Signature</p>
              </div>
            </div>

            {/* Seal */}
            <div className="absolute bottom-8 right-8 opacity-10">
              <svg className="h-32 w-32 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;