import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import apiClient from "../../lib/apiClient";
import { toast } from "sonner";

interface AccountStatus {
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  requirements?: {
    currently_due?: string[];
    eventually_due?: string[];
    past_due?: string[];
  };
}

export function StripeConnectSetup() {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);

  useEffect(() => {
    checkAccountStatus();
  }, []);

  const checkAccountStatus = async () => {
    setCheckingStatus(true);
    try {
      const response = await apiClient.get('/stripe/connect/account_status/');
      setAccountStatus(response.data);
      setHasAccount(true);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No account yet
        setHasAccount(false);
        setAccountStatus(null);
      } else {
        console.error('Error checking account status:', error);
      }
    } finally {
      setCheckingStatus(false);
    }
  };

  const createStripeAccount = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/stripe/connect/create_account/');
      const { onboarding_url } = response.data;
      
      // Open Stripe onboarding in new tab
      window.open(onboarding_url, '_blank');
      
      toast.success("Stripe onboarding opened in new tab. Complete the setup and return here.");
      
      // Check status after a delay
      setTimeout(() => {
        checkAccountStatus();
      }, 5000);
      
    } catch (error: any) {
      console.error('Error creating Stripe account:', error);
      toast.error(error.response?.data?.error || "Failed to create Stripe account");
    } finally {
      setLoading(false);
    }
  };

  const refreshOnboarding = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post('/stripe/connect/refresh_onboarding/');
      const { onboarding_url } = response.data;
      
      // Open Stripe onboarding in new tab
      window.open(onboarding_url, '_blank');
      
      toast.info("Stripe onboarding reopened. Complete the setup and return here.");
      
      // Check status after a delay
      setTimeout(() => {
        checkAccountStatus();
      }, 5000);
      
    } catch (error: any) {
      console.error('Error refreshing onboarding:', error);
      toast.error(error.response?.data?.error || "Failed to refresh onboarding link");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Stripe Connect Setup</CardTitle>
          <CardDescription>Setting up your payment account</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Account fully set up and ready
  // For Pakistan: Only payouts_enabled matters (no charges_enabled capability)
  if (hasAccount && accountStatus?.payouts_enabled && accountStatus?.details_submitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Stripe Account Connected
          </CardTitle>
          <CardDescription>Your account is fully set up and ready to receive payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="space-y-2">
                <p><strong>✓ Payouts enabled:</strong> You can receive money from sales</p>
                <p><strong>✓ Account verified:</strong> Your details are complete</p>
                <p className="text-sm text-green-700 mt-2">You're all set! Buyers can now purchase your products.</p>
              </div>
            </AlertDescription>
          </Alert>

          <Button 
            variant="outline" 
            onClick={checkAccountStatus}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Account exists but needs more setup
  if (hasAccount && accountStatus) {
    const needsAction = !accountStatus.payouts_enabled || !accountStatus.details_submitted;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Complete Your Stripe Setup
          </CardTitle>
          <CardDescription>Additional information required to activate your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <div className="space-y-2">
                <p className="font-semibold mb-2">Account Status:</p>
                <p className={accountStatus.payouts_enabled ? "text-green-700" : "text-red-700"}>
                  {accountStatus.payouts_enabled ? "✓" : "✗"} Payouts enabled: {accountStatus.payouts_enabled ? "Yes" : "No"}
                </p>
                <p className={accountStatus.details_submitted ? "text-green-700" : "text-red-700"}>
                  {accountStatus.details_submitted ? "✓" : "✗"} Details submitted: {accountStatus.details_submitted ? "Yes" : "No"}
                </p>
                
                {accountStatus.requirements?.currently_due && accountStatus.requirements.currently_due.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="font-semibold text-red-800 mb-1">Required Information:</p>
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {accountStatus.requirements.currently_due.map((req, i) => (
                        <li key={i}>{req.replace(/_/g, ' ')}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button 
              onClick={refreshOnboarding}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <><ExternalLink className="mr-2 h-4 w-4" /> Complete Stripe Setup</>
              )}
            </Button>

            <Button 
              variant="outline" 
              onClick={checkAccountStatus}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            You must complete the Stripe setup before you can receive payments from buyers.
          </p>
        </CardContent>
      </Card>
    );
  }

  // No account - need to create one
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Your Stripe Account</CardTitle>
        <CardDescription>Set up payments to receive money from sales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Why do I need this?</p>
            <p className="mb-2">
              To sell on MadeInPK and receive payments, you need to connect a Stripe account. 
              This allows us to securely transfer your earnings to you after each sale.
            </p>
            <p className="text-sm text-gray-600">
              Stripe is a secure payment processor trusted by millions of businesses worldwide.
            </p>
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What you'll need:</h4>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Your national ID card (CNIC)</li>
            <li>Bank account details</li>
            <li>Business information (if applicable)</li>
            <li>Contact information</li>
          </ul>
        </div>

        <Button 
          onClick={createStripeAccount}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Account...</>
          ) : (
            <><ExternalLink className="mr-2 h-5 w-5" /> Connect Stripe Account</>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          This will open Stripe's secure setup page in a new tab. 
          Complete the setup and return here to start selling.
        </p>
      </CardContent>
    </Card>
  );
}
