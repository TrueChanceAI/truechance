import { NextRequest, NextResponse } from 'next/server';
import Vapi from "@vapi-ai/web";

// Initialize Vapi server-side with the secure token
const vapiToken = process.env.VAPI_WEB_TOKEN;

if (!vapiToken) {
  console.error('VAPI_WEB_TOKEN is not set in environment variables');
  throw new Error('VAPI_WEB_TOKEN environment variable is required');
}

console.log('Initializing Vapi with token:', vapiToken.substring(0, 8) + '...');

const vapi = new Vapi(vapiToken);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    // Log the request for debugging
    console.log('Vapi API request:', { action, params });

    switch (action) {
      case 'start':
        // Handle starting a call with proper parameters
        console.log('Starting Vapi call with config:', params.config);
        
        // The Vapi start method expects different parameters
        const startResponse = await vapi.start(
          params.config.assistant, // assistant config
          params.config.assistantOverrides, // voice settings
          undefined, // transcriber (optional)
          params.workflowId, // workflow ID
          params.config.variableValues // variable values
        );
        
        console.log('Vapi start response:', startResponse);
        return NextResponse.json({ success: true, data: startResponse });

      case 'stop':
        // Handle stopping a call
        const stopResponse = await vapi.stop();
        return NextResponse.json({ success: true, data: stopResponse });

      case 'create':
        // Handle creating a call - using start with create parameters
        const createResponse = await vapi.start(
          params.config.assistant,
          params.config.assistantOverrides,
          undefined,
          params.workflowId,
          params.config.variableValues
        );
        return NextResponse.json({ success: true, data: createResponse });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Vapi API error:', error);
    
    // Return more detailed error information
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          error: 'Vapi API error', 
          message: error.message,
          details: error
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('callId');

    if (!callId) {
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }

    // For now, return call ID since Vapi doesn't have a get method
    // You can implement call status tracking in your database if needed
    return NextResponse.json({ 
      success: true, 
      data: { callId, status: 'active' } 
    });
  } catch (error) {
    console.error('Vapi GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
