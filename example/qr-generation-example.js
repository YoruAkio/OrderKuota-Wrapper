import OrderKuota from '../dist/index.js';
import fs from 'fs';

/**
 * Example demonstrating QRIS QR code generation functionality
 * 
 * This example shows how to:
 * 1. Generate a QRIS string for a specific amount
 * 2. Create a QR code image from the QRIS string
 * 3. Generate a QR code directly with amount in one step
 * 4. Save the QR code image to a file
 */

async function demonstrateQrGeneration() {
    try {
        // Initialize OrderKuota client with your credentials
        const client = new OrderKuota({
            username: 'your-username',
            password: 'your-password',
            userid: 'your-userid',
            apikey: 'your-apikey',
            pin: 'your-pin',
            // Base QRIS string is required for QR generation
            baseQrString: 'your-base-qris-string-here'
        });

        console.log('🔍 Checking if QRIS generation is available...');
        
        if (!client.isQrisGenerationAvailable()) {
            console.log('❌ QRIS generation is not available. Please provide baseQrString in configuration.');
            return;
        }

        console.log('✅ QRIS generation is available!');
        console.log('');

        // Example 1: Generate QRIS string and then convert to QR image
        console.log('📝 Example 1: Generate QRIS string and convert to QR image');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const amount1 = 50000; // 50,000 IDR
        console.log(`💰 Generating QRIS for ${amount1.toLocaleString()} IDR...`);
        
        const qrisString = await client.generateQrisString(amount1);
        console.log(`📄 QRIS String: ${qrisString.substring(0, 50)}...`);
        
        const qrImageBase64 = await client.generateQrisImage(qrisString, {
            width: 256,
            margin: 4,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        
        console.log(`🖼️  QR Image generated (${qrImageBase64.length} characters base64)`);
        
        // Save to file
        fs.writeFileSync('qr-code-example1.png', qrImageBase64, 'base64');
        console.log('💾 QR code saved as qr-code-example1.png');
        console.log('');

        // Example 2: Generate QR code directly with amount
        console.log('🚀 Example 2: Generate QR code directly with amount');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const amount2 = 100000; // 100,000 IDR
        console.log(`💰 Generating QR code for ${amount2.toLocaleString()} IDR...`);
        
        const qrCodeBase64 = await client.generateQrisQrCode(amount2, {
            width: 512,
            margin: 6,
            color: {
                dark: '#1a1a1a',
                light: '#f5f5f5'
            }
        });
        
        console.log(`🖼️  QR Code generated (${qrCodeBase64.length} characters base64)`);
        
        // Save to file
        fs.writeFileSync('qr-code-example2.png', qrCodeBase64, 'base64');
        console.log('💾 QR code saved as qr-code-example2.png');
        console.log('');

        // Example 3: Generate HTML file with QR codes
        console.log('🌐 Example 3: Generate HTML file with embedded QR codes');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QRIS QR Code Examples</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .qr-container {
            text-align: center;
            margin: 20px 0;
        }
        .qr-image {
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            max-width: 100%;
            height: auto;
        }
        .amount {
            font-size: 24px;
            font-weight: bold;
            color: #2c5530;
            margin: 10px 0;
        }
        .description {
            color: #666;
            line-height: 1.5;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }
        .footer {
            text-align: center;
            color: #888;
            margin-top: 40px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>🏦 QRIS Payment QR Codes</h1>
    
    <div class="card">
        <h2>💰 Payment: Rp ${amount1.toLocaleString()}</h2>
        <p class="description">
            This QR code was generated using the two-step process: first generating the QRIS string, 
            then converting it to a QR code image with custom styling.
        </p>
        <div class="qr-container">
            <img src="data:image/png;base64,${qrImageBase64}" alt="QR Code for ${amount1.toLocaleString()} IDR" class="qr-image">
        </div>
        <div class="amount">Rp ${amount1.toLocaleString()}</div>
    </div>
    
    <div class="card">
        <h2>💰 Payment: Rp ${amount2.toLocaleString()}</h2>
        <p class="description">
            This QR code was generated using the one-step process with custom colors and larger size. 
            The dark color is slightly gray (#1a1a1a) and the background is off-white (#f5f5f5).
        </p>
        <div class="qr-container">
            <img src="data:image/png;base64,${qrCodeBase64}" alt="QR Code for ${amount2.toLocaleString()} IDR" class="qr-image">
        </div>
        <div class="amount">Rp ${amount2.toLocaleString()}</div>
    </div>
    
    <div class="footer">
        <p>Generated using OrderKuota-Wrapper with QRIS QR Code generation</p>
        <p>Scan these QR codes with any Indonesian payment app to make payments</p>
    </div>
</body>
</html>`;
        
        fs.writeFileSync('qr-codes-demo.html', htmlContent);
        console.log('🌐 HTML demo file saved as qr-codes-demo.html');
        console.log('');

        console.log('🎉 All examples completed successfully!');
        console.log('📁 Generated files:');
        console.log('   • qr-code-example1.png - QR code for Rp 50,000');
        console.log('   • qr-code-example2.png - QR code for Rp 100,000');
        console.log('   • qr-codes-demo.html - HTML demo with embedded QR codes');
        console.log('');
        console.log('💡 Tips:');
        console.log('   • Use generateQrisQrCode() for one-step generation');
        console.log('   • Use generateQrisString() + generateQrisImage() for more control');
        console.log('   • Customize QR code appearance with width, margin, and colors');
        console.log('   • Base64 images can be used directly in web applications');

    } catch (error) {
        console.error('❌ Error during QR code generation:', error.message);
        
        if (error.code) {
            console.error(`🔍 Error Code: ${error.code}`);
        }
        
        if (error.code === 'MISSING_BASE_QR_STRING') {
            console.log('');
            console.log('💡 To fix this error:');
            console.log('   1. Obtain a base QRIS string from your payment provider');
            console.log('   2. Add it to the OrderKuota configuration:');
            console.log('      baseQrString: "your-base-qris-string-here"');
        }
    }
}

// Run the demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
    demonstrateQrGeneration();
}

export default demonstrateQrGeneration;
